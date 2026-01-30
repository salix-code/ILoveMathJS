package questions

import (
	"fmt"
	"math/rand"
)

// 等差数量

func init() {
	qt := GetQuestionTemplate()
	qt.RegisterTemplate(3, 1, 1, new(QuestionTemplate31_1))

}

type QuestionTemplate31_1 struct {
	mode       int
	firstTerm  int
	commonDiff int
	termIndex  int
	askIdex    int
}

func (me *QuestionTemplate31_1) randomData() {
	me.mode = rand.Intn(3)
	me.firstTerm = rand.Intn(10) + 1 // 首项在1到10之间
	me.commonDiff = rand.Intn(3) + 3 // 公差在3到5之间
	me.termIndex = 5
	me.askIdex = rand.Intn(10) + 10 // 询问的项数在6到15之间
}

func (me *QuestionTemplate31_1) generateQuestion() string {
	question := "数列："

	for i := 0; i < me.termIndex; i++ {
		question += fmt.Sprintf("%d, ", me.firstTerm+i*me.commonDiff)
	}
	switch me.mode {
	case 0:
		question += fmt.Sprintf(".........，那么数字 %d 在第几个位置", me.askIdex*me.commonDiff+me.firstTerm)
	case 1:
		question += fmt.Sprintf(".........，那么第 %d 项的数字是多少", me.askIdex)
	case 2:
		question += fmt.Sprintf(".........，%d，一共有多少个数字？", me.askIdex*me.commonDiff+me.firstTerm)
	}

	return question
}

func (me *QuestionTemplate31_1) getKey() int {
	return hashHelper.HashInt(me.firstTerm, me.commonDiff, me.termIndex, me.askIdex)
}
