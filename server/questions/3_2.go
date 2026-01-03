package questions

import (
	"fmt"
	"math/rand"
)

// 公式代换
func init() {
	qt := GetQuestionTemplate()
	qt.RegisterTemplate(3, 2, 1, New_3_2_1())
}

func New_3_2_1() *QuestionTemplate_3_2_1 {
	return &QuestionTemplate_3_2_1{}
}

type QuestionTemplate_3_2_1 struct {
}

func (me *QuestionTemplate_3_2_1) randomData() {

}

func (me *QuestionTemplate_3_2_1) generateQuestion() string {
	triangle := "▲"
	title := "定义公式a" + triangle + "b = "

	mode := rand.Intn(3)
	switch mode {
	case 0:
		title += "a × a + b × b + 2 × a × b"
		total := (rand.Intn(3) + 1) * 10
		a := rand.Intn(total/2-1) + 1
		b := total - a
		title += fmt.Sprintf("，求%d", a) + triangle + fmt.Sprintf("%d", b) + "的结果：\n"
	case 1:
		title += "a × a + b × b - 2 × a × b"
		total := (rand.Intn(3) + 1) * 10
		b := rand.Intn(total/2-1) + 1
		a := total + b
		title += fmt.Sprintf("，求%d", a) + triangle + fmt.Sprintf("%d", b) + "的结果：\n"
	case 2:
		title += "(a + b) × (a - b)"
		b := (rand.Intn(3) + 1) * 5
		a := rand.Intn(10) + b + 1
		title += fmt.Sprintf("，求%d", a) + triangle + fmt.Sprintf("%d", b) + "的结果：\n"
	default:
		break
	}
	return title
}

func (me *QuestionTemplate_3_2_1) getKey() int {
	return hashHelper.HashInt(0)
}
