package questions

import (
	"fmt"
	"math/rand"

	"github.com/gin-gonic/gin"
)

func init() {
	qt := GetQuestionTemplate()
	qt.RegisterTemplate(6, 16, new(QuestionTemplate616_1))
}

type QuestionTemplate616_1 struct {
	number [5]int
	name   []string
}

func (me *QuestionTemplate616_1) randomData() {
	if len(me.name) == 0 {
		me.name = append(me.name, "苹果", "鸭梨", "香蕉", "羊", "兔", "骆驼")
	}
	me.number[0] = rand.Intn(3) + 2
	me.number[1] = me.number[0] * (rand.Intn(3) + 2)
	me.number[2] = rand.Intn(5) + 2
	me.number[3] = me.number[2] * (rand.Intn(2) + 2)
	me.number[4] = rand.Intn(5) + 2
}

func (me *QuestionTemplate616_1) generateQuestion() string {
	index := rand.Intn(len(me.name)/3) * 3
	return fmt.Sprintf("%d只%s可以换%d只%s,%d只%s可以换%d只%s，问：%d只%s可以换多少只%s？",
		me.number[0], me.name[index], me.number[1], me.name[index+1], me.number[2], me.name[index], me.number[3], me.name[2+index], me.number[4], me.name[2+index], me.name[1+index])
}

func (me *QuestionTemplate616_1) getID() int {
	return 1
}

type QuestionTemplate616_2 struct {
	baseketball int
	volleyball  int
	totalPrice  int
	number      [2]int
}

func (me *QuestionTemplate616_2) randomData() {
	me.number[0] = rand.Intn(3) + 2
	me.number[1] = me.number[0]
	if me.number[0]%2 == 0 {
		me.number[1] = me.number[0] + (rand.Intn(3)*2 + 2) - 1
	} else {
		me.number[1] = me.number[0] + (rand.Intn(3)*2 + 2)
	}
	scaleValue := (rand.Intn(5) + 2)
	me.baseketball = me.number[0] * scaleValue

	me.volleyball = rand.Intn(me.baseketball-2) + 1
	me.totalPrice = (me.volleyball + me.number[1]*scaleValue) * (rand.Intn(10) + 10)

}

func (me *QuestionTemplate616_2) getID() int {
	return 2
}

func (me *QuestionTemplate616_2) generateQuestion() string {
	title := fmt.Sprintf("学校买了%d个蓝球和%d个排球，一共用了%d元，", me.baseketball, me.volleyball, me.totalPrice)
	title += fmt.Sprintf("%d个蓝球与%d个排球的价钱相等，", me.number[0], me.number[1])
	title += fmt.Sprintf("每一个蓝球多少元")
	return title
}

type QuestionTemplate616_3 struct {
	scienceBook int
	storyBook   int
	essayBook   int
}

func (me *QuestionTemplate616_3) randomData() {
	me.scienceBook = (rand.Intn(20) + 40)
	me.storyBook = (rand.Intn(30) + 30)
	me.essayBook = (rand.Intn(40) + 20)
}

func (me *QuestionTemplate616_3) generateQuestion() string {
	title := fmt.Sprintf("某班有一个图书角，共有")
	title += fmt.Sprintf("故事书和科技书%d本，", me.storyBook+me.scienceBook)
	title += fmt.Sprintf("故事书和作文书%d本，", me.storyBook+me.essayBook)
	title += fmt.Sprintf("科技书和作文书%d本，", me.scienceBook+me.essayBook)
	title += fmt.Sprintf("每一个各类种有多少本书？")
	return title

}

func (me *QuestionTemplate616_3) getID() int {
	return 3
}

func GenerateMath616Questions(subtype string, count int) []interface{} {
	qs := make([]interface{}, count)
	tplContainer := GetQuestionTemplate()

	for i := 0; i < count; i++ {

		var questionText string
		switch subtype {
		case "type1":
			tpl := tplContainer.GetTemplate(6, 16, 1)

			tpl.randomData()
			questionText = tpl.generateQuestion()

		case "type2":
			tpl := tplContainer.GetTemplate(6, 16, 2)
			tpl.randomData()
			questionText = tpl.generateQuestion()

		case "type3":
			tpl := tplContainer.GetTemplate(6, 16, 3)
			tpl.randomData()
			questionText = tpl.generateQuestion()

		case "type4":

		case "type5":

		default:

		}

		qs[i] = gin.H{
			"number":      i + 1,
			"content":     questionText,
			"type":        "鸡兔同笼",
			"subtype":     subtype,
			"answerLines": 1,
		}
	}

	return qs
}
