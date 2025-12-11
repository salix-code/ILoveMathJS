package questions

import "sync"

type IQuestionTemplate interface {
	randomData()
	generateQuestion() string
	getID() int
	getKey() int
}

type FQuestionTemplate struct {
	Templates map[int][]IQuestionTemplate
}

func hashKey(Chapter int, Section int) int {
	return Chapter*10000 + Section*100 + 0
}

func (me *FQuestionTemplate) RegisterTemplate(Chapter int, Section int, tpl IQuestionTemplate) {
	if _, err := me.Templates[hashKey(Chapter, Section)]; err {
		me.Templates[hashKey(Chapter, Section)] = []IQuestionTemplate{}
	}
	me.Templates[hashKey(Chapter, Section)] = append(me.Templates[hashKey(Chapter, Section)], tpl)
}
func (me *FQuestionTemplate) GetTemplate(Chapter int, Section int, id int) IQuestionTemplate {
	if _, err := me.Templates[hashKey(Chapter, Section)]; err {
		return nil
	}
	for _, t := range me.Templates[hashKey(Chapter, Section)] {
		if t.getID() == id {
			return t
		}
	}

	return nil
}

var (
	qt616     *FQuestionTemplate
	qt616Once sync.Once
)

func GetQuestionTemplate() *FQuestionTemplate {
	qt616Once.Do(func() {
		qt616 = &FQuestionTemplate{
			Templates: make(map[int]IQuestionTemplate),
		}
	})
	return qt616
}
