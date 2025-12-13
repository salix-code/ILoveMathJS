package questions

import (
	"fmt"
	"math/rand"
)

func init() {
	qt := GetQuestionTemplate()
	qt.RegisterTemplate(5, 12, 1, new(QuestionTemplate512_1))
}

type QuestionTemplate512_1 struct {
	feet  int
	inch  int
	count int
}

func (me *QuestionTemplate512_1) randomData() {
	me.feet = rand.Intn(8) + 5  // 总物品数在5到12之间
	me.inch = rand.Intn(11) + 1 // 选择的物品数在1到12之间
	me.count = rand.Intn(5) + 4 // 重复次数在4到9之间
}

func (me *QuestionTemplate512_1) generateQuestion() string {
	question := "已知一英尺等於12英寸，一條水管長%d英尺%d英寸，那麼%d條同樣的水管共長多少英尺多少英寸？"
	return fmt.Sprintf(question, me.feet, me.inch, me.count)
}

func (me *QuestionTemplate512_1) getKey() int {
	return hashHelper.HashInt(me.feet, me.inch, me.count)
}
