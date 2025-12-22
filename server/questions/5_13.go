package questions

import (
	"math/rand"
)

func init() {
	qt := GetQuestionTemplate()
	qt.RegisterTemplate(5, 13, 1, new(QuestionTemplate513_1))

}

type QuestionTemplate513_1 struct {
	Total       int
	Mulitiplier int
}

func (me *QuestionTemplate513_1) randomData() {
	a := rand.Intn(5) + 5
	b := rand.Intn(20) + 20
	me.Total = a * b
	me.Mulitiplier = a - 1

}
func (me *QuestionTemplate513_1) generateQuestion() string {
	titlePool := []string{
		"已知哥哥游戲卡是弟弟的{Mulitiplier}倍，他們總共有{Total}張游戲卡，他們分別有多少張游戲卡？",
		"媽媽買了{Total}個蘋果給哥哥和弟弟，哥哥的蘋果數是弟弟的{Mulitiplier}倍，他們各有多少個蘋果？",
		"小白兔有胡蘿蔔和大白菜共{Total}棵，胡蘿蔔是大白菜的{Mulitiplier}倍，小白兔各有多少棵胡蘿蔔和大白菜？",
		"体育室有篮球和足球共{Total}个，篮球是足球的{Mulitiplier}倍，体育室各有多少个篮球和足球？",
	}

	titleIndex := rand.Intn(len(titlePool))
	return RenderWithStruct(titlePool[titleIndex], me)
}
func (me *QuestionTemplate513_1) getKey() int {
	return hashHelper.HashInt(me.Total, me.Mulitiplier)

}
