package questions

import (
	"bytes"
	"fmt"
	"io"
	"reflect"
	"strings"
	"sync"

	"github.com/valyala/fasttemplate"
)

var (
	// 缓存类型字段名到索引，提升性能
	typeFieldCache sync.Map // map[reflect.Type]map[string]int
)

// RenderWithStruct 使用 fasttemplate 渲染 tpl（占位符用 {name}），data 可以是 struct、*struct、map[string]T
func RenderWithStruct(tpl string, data interface{}) string {
	t := fasttemplate.New(tpl, "{", "}")
	var buf bytes.Buffer
	// 使用 ExecuteFunc 将结果写入 buffer（兼容不同版本的 fasttemplate）
	_, _ = t.ExecuteFunc(&buf, func(w io.Writer, tag string) (int, error) {
		val, ok := resolveByName(data, tag)
		var s string
		if ok {
			s = fmt.Sprint(val)
		} else {
			s = ""
		}
		return w.Write([]byte(s))
	})
	return buf.String()
}

// resolveByName 支持 dot path，例如 "Person.Name"；返回 (value, true) 或 ("", false)
func resolveByName(data interface{}, path string) (interface{}, bool) {
	if data == nil {
		return nil, false
	}
	parts := strings.Split(path, ".")
	v := reflect.ValueOf(data)
	// 解引用指针
	for v.Kind() == reflect.Ptr || v.Kind() == reflect.Interface {
		if v.IsNil() {
			return nil, false
		}
		v = v.Elem()
	}

	// 如果是 map[string]T，优先从 map 中取
	if v.Kind() == reflect.Map && v.Type().Key().Kind() == reflect.String {
		// 支持 nested map path
		return resolveFromMap(v, parts)
	}

	// 逐段在结构体字段中查找
	for _, p := range parts {
		// ensure value is addressable/struct
		if v.Kind() == reflect.Ptr || v.Kind() == reflect.Interface {
			if v.IsNil() {
				return nil, false
			}
			v = v.Elem()
		}

		switch v.Kind() {
		case reflect.Struct:
			// 使用缓存加速 FieldByName 查找
			ft := v.Type()
			cacheAny, _ := typeFieldCache.LoadOrStore(ft, buildFieldIndexMap(ft))
			fieldMap := cacheAny.(map[string]int)
			if idx, ok := fieldMap[p]; ok {
				f := v.Field(idx)
				// 如果字段是未导出（无法 Interface），尝试用 fmt.Sprint 取值（不过一般不可访问）
				if !f.CanInterface() {
					return nil, false
				}
				v = f
				continue
			}
			// 尝试按小写首字母匹配（在某些情形）
			// 也可尝试方法调用： MethodByName
			// 方法优先：如果有导出方法且返回一个值，则调用（零参）
			m := v.MethodByName(p)
			if m.IsValid() && m.Kind() == reflect.Func && m.Type().NumIn() == 0 && m.Type().NumOut() >= 1 {
				res := m.Call(nil)
				v = res[0]
				continue
			}
			return nil, false

		case reflect.Map:
			// nested map
			if v.Type().Key().Kind() != reflect.String {
				return nil, false
			}
			return resolveFromMap(v, parts)
		default:
			return nil, false
		}
	}

	// 最终获取值
	if !v.IsValid() {
		return nil, false
	}
	if v.Kind() == reflect.Ptr && v.IsNil() {
		return nil, false
	}
	if v.CanInterface() {
		return v.Interface(), true
	}
	return nil, false
}

func resolveFromMap(v reflect.Value, parts []string) (interface{}, bool) {
	cur := v
	for i, p := range parts {
		// map key must be string
		key := reflect.ValueOf(p)
		val := cur.MapIndex(key)
		if !val.IsValid() {
			return nil, false
		}
		// 如果是最后一段，返回
		if i == len(parts)-1 {
			return val.Interface(), true
		}
		// 否则继续遍历，解引用
		cur = val
		for cur.Kind() == reflect.Ptr || cur.Kind() == reflect.Interface {
			if cur.IsNil() {
				return nil, false
			}
			cur = cur.Elem()
		}
		if cur.Kind() != reflect.Map {
			return nil, false
		}
	}
	return nil, false
}

func buildFieldIndexMap(t reflect.Type) map[string]int {
	m := map[string]int{}
	// 只处理当前类型的导出字段（嵌入字段可扩展）
	for i := 0; i < t.NumField(); i++ {
		f := t.Field(i)
		if f.PkgPath != "" {
			// 非导出字段跳过
			continue
		}
		name := f.Name
		// 支持 tag 名称： `template:"Total"`
		if tag := f.Tag.Get("template"); tag != "" {
			name = tag
		}
		m[name] = i
	}
	return m
}
