package questions

import (
	"fmt"
	"hash/fnv"
	"html/template"
	"sync"
)

type IQuestionTemplate interface {
	randomData()
	generateQuestion() string
	getKey() int
}

type FQuestionTemplate struct {
	Templates map[int]IQuestionTemplate
}

func hashKey(Chapter int, Section int, subType int) int {
	return Chapter*10000 + Section*100 + subType
}

func (me *FQuestionTemplate) RegisterTemplate(Chapter int, Section int, subType int, tpl IQuestionTemplate) {
	me.Templates[hashKey(Chapter, Section, subType)] = tpl
}
func (me *FQuestionTemplate) GetTemplate(Chapter int, Section int, subType int) IQuestionTemplate {

	qt, err := me.Templates[hashKey(Chapter, Section, subType)]
	if !err {
		return nil
	}
	return qt
}

var (
	qt     *FQuestionTemplate
	qtOnce sync.Once
)

func GetQuestionTemplate() *FQuestionTemplate {
	qtOnce.Do(func() {
		qt = &FQuestionTemplate{
			Templates: make(map[int]IQuestionTemplate),
		}
	})
	return qt
}

// Question 统一的题目结构
type Question struct {
	Number      int           `json:"number"`
	Content     template.HTML `json:"content"` // 使用 template.HTML 类型
	Type        string        `json:"type"`
	Subtype     string        `json:"subtype"`
	AnswerLines int           `json:"answerLines"`
	Answer      interface{}   `json:"answer,omitempty"` // 可选的答案字段
}

// NewQuestion 创建题目的辅助函数
func NewQuestion(number int, content string, answerLines int) Question {
	return Question{
		Number:      number,
		Content:     template.HTML(content), // 自动转换为 template.HTML
		AnswerLines: answerLines,
	}
}

func GenerateQuestions(Chapter int, Section int, SubType int, count int) []interface{} {
	tplContainer := GetQuestionTemplate()
	tpl := tplContainer.GetTemplate(Chapter, Section, SubType)
	if tpl == nil {
		return nil
	}
	qs := make([]interface{}, count)
	for i := 0; i < count; i++ {
		tpl.randomData()
		questionText := tpl.generateQuestion()
		qs[i] = NewQuestion(i+1, questionText, 1)
	}
	return qs

}

// HashHelper 通用 hash 生成器
type HashHelper struct{}

func NewHashHelper() *HashHelper {
	return &HashHelper{}
}

// Hash 将任意数据转为 uint64 hash
func (h *HashHelper) Hash(data ...interface{}) uint64 {
	hasher := fnv.New64a()
	hasher.Write([]byte(fmt.Sprint(data...)))
	return hasher.Sum64()
}

// HashInt 返回 int 类型的 hash
func (h *HashHelper) HashInt(data ...interface{}) int {
	return int(h.Hash(data...) & 0x7FFFFFFF) // 确保正数
}

// 全局实例
var hashHelper = NewHashHelper()
