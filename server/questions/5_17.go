package questions

import (
	"math/rand"
)

func init() {
	qt := GetQuestionTemplate()
	qt.RegisterTemplate(5, 17, 1, new(QuestionTemplate517_1))
}

type QuestionTemplate517_1 struct {
	children int
	candies  [2]int
	leftover [2]int
}

func (me *QuestionTemplate517_1) randomData() {
	me.children = rand.Intn(20) + 10

}

func (me *QuestionTemplate517_1) generateQuestion() string {

	question := "丁丁给小朋友分糖，每人5块还剩下3块，每人4块还剩下9块，问多少小朋友分多少块糖？"
	return question
}

func (me *QuestionTemplate517_1) getKey() int {
	return 0 // 该题目没有变化参数，返回固定键值
}
