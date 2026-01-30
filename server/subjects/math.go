package subjects

import (
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
)

type IQuestionGenerator interface {
	RandomData()
	Generate() string
	GetKey() int
}

type GeneratorFactory func() IQuestionGenerator

type LazyGenerator struct {
	factory  GeneratorFactory
	instance IQuestionGenerator
	once     sync.Once
}

func (l *LazyGenerator) Get() IQuestionGenerator {
	l.once.Do(func() {
		if l.factory != nil {
			l.instance = l.factory()
		}
	})
	return l.instance
}

type FCategoryItem struct {
	Category int
	Title    string
	Loader   *LazyGenerator
}

type FSubjectItem struct {
	Tag   string
	Title string
}

type FSubjectItems struct {
	Items       []FSubjectItem
	CategoryMap map[string][]FCategoryItem
}

func (me *FSubjectItems) Register(tag string, title string) {
	me.Items = append(me.Items, FSubjectItem{
		Tag:   tag,
		Title: title,
	})
	me.CategoryMap[tag] = []FCategoryItem{}
}

func (me *FSubjectItems) FindSubjecy(tag string) *FSubjectItem {
	for idx, item := range me.Items {
		if item.Tag == tag {
			return &me.Items[idx]
		}
	}
	return nil
}

func (me *FSubjectItems) FetchCategory(tag string) []FCategoryItem {
	return me.CategoryMap[tag]
}

func (me *FSubjectItems) GetQuestionGenerator(tag string, category int) IQuestionGenerator {
	items := me.CategoryMap[tag]
	for _, item := range items {
		if item.Category == category {
			return item.Loader.Get()
		}
	}
	return nil
}

func (me *FSubjectItems) AddCategory(subjectTag string, category int, title string, factory GeneratorFactory) {
	if _, exists := me.CategoryMap[subjectTag]; !exists {
		return
	}
	me.CategoryMap[subjectTag] = append(me.CategoryMap[subjectTag], FCategoryItem{
		Category: category,
		Title:    title,
		Loader: &LazyGenerator{
			factory: factory,
		},
	})
}

var (
	single *FSubjectItems
	once   sync.Once
)

func GetMathSubjectsInstance() *FSubjectItems {
	once.Do(func() {
		single = &FSubjectItems{
			Items:       []FSubjectItem{},
			CategoryMap: make(map[string][]FCategoryItem),
		}
	})
	return single
}

func HandleMathPage(c *gin.Context) {
	items := GetMathSubjectsInstance().Items

	c.HTML(http.StatusOK, "math.html", gin.H{
		"Subject": "math",
		"Items":   items,
	})
}
