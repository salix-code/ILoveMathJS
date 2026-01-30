package questions

// 等价代换
import (
	"fmt"
	"math/rand"
	"mymathjs/server/subjects"
	"strings"
)

func init() {
	subject := subjects.GetMathSubjectsInstance()
	subject.Register("6.16", "等量代換")

	subject.AddCategory("6.16", 2, "买卖同价", NewQuestionTemplate616_2)
	subject.AddCategory("6.16", 3, "整体部分", NewQuestionTemplate616_3)
	subject.AddCategory("6.16", 4, "三者关系", NewQuestionTemplate616_4)
	subject.AddCategory("6.16", 5, "合资购物", NewQuestionTemplate616_5)
}

func NewQuestionTemplate616_2() subjects.IQuestionGenerator {
	return &QuestionTemplate616_2{}
}

type QuestionTemplate616_2 struct {
	baseketball int
	volleyball  int
	totalPrice  int
	number      [2]int
}

func (me *QuestionTemplate616_2) RandomData() {
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

func (me *QuestionTemplate616_2) Generate() string {
	title := fmt.Sprintf("学校买了%d个蓝球和%d个排球，一共用了%d元，", me.baseketball, me.volleyball, me.totalPrice)
	title += fmt.Sprintf("%d个蓝球与%d个排球的价钱相等，", me.number[0], me.number[1])
	title += "每一个蓝球多少元"
	return title
}
func (me *QuestionTemplate616_2) GetKey() int {
	return hashHelper.HashInt(me.baseketball, me.volleyball, me.totalPrice)
}

func NewQuestionTemplate616_3() subjects.IQuestionGenerator {
	return &QuestionTemplate616_3{}
}

type QuestionTemplate616_3 struct {
	storyBook   int
	scienceBook int
	essayBook   int
}

func (me *QuestionTemplate616_3) RandomData() {
	me.storyBook = (rand.Intn(30) + 30)
	me.scienceBook = (rand.Intn(20) + 40)
	me.essayBook = (rand.Intn(40) + 20)
}

func (me *QuestionTemplate616_3) Generate() string {
	namePool := [][]string{
		{"某班有一个图书角，共有", "故事书", "科技书", "作文书", "本"},
		{"妈妈买了一些水果，共有", "苹果", "香蕉", "鸭梨", "个"},
		{"小明有一些文具，共有", "铅笔", "橡皮", "尺子", "支"},
		{"小红有一些玩具，共有", "布娃娃", "积木", "玩偶", "个"},
		{"班主任把一些花生分給小花，小石和小奧，其中", "小花", "小石", "小奧", "颗"},
	}
	nameIndex := rand.Intn(len(namePool))
	title := namePool[nameIndex][0]
	title += fmt.Sprintf("%s和%s共有%d%s，", namePool[nameIndex][1], namePool[nameIndex][2], me.storyBook+me.scienceBook, namePool[nameIndex][4])
	title += fmt.Sprintf("%s和%s共有%d%s，", namePool[nameIndex][1], namePool[nameIndex][3], me.storyBook+me.essayBook, namePool[nameIndex][4])
	title += fmt.Sprintf("%s和%s共有%d%s，", namePool[nameIndex][2], namePool[nameIndex][3], me.scienceBook+me.essayBook, namePool[nameIndex][4])
	title += fmt.Sprintf("各类各有多少%s？", namePool[nameIndex][4])
	return title
}

func (me *QuestionTemplate616_3) GetKey() int {
	return hashHelper.HashInt(me.scienceBook, me.storyBook, me.essayBook)
}

func NewQuestionTemplate616_4() subjects.IQuestionGenerator {
	return &QuestionTemplate616_4{}
}

type QuestionTemplate616_4 struct {
	pear   int
	apple  int
	orange int
}

func (me *QuestionTemplate616_4) RandomData() {
	me.pear = rand.Intn(10) + 10
	me.apple = rand.Intn(10) + 10
	me.orange = rand.Intn(10) + 10
}
func (me *QuestionTemplate616_4) Generate() string {
	a := 1
	b := a + rand.Intn(3) + 1
	total := me.pear + me.apple + me.orange
	condition := []string{
		fmt.Sprintf("%d個梨子 ＋ %d個蘋果 ＋ %d個桔子 = %d克", a, a, b, total+me.orange*(b-a)),
		fmt.Sprintf("%d個梨子 ＋ %d個蘋果 ＋ %d個桔子 = %d克", a, b, a, total+me.apple*(b-a)),
		fmt.Sprintf("%d個梨子 ＋ %d個蘋果 ＋ %d個桔子 = %d克", b, a, a, total+me.pear*(b-a)),
	}
	return fmt.Sprintf(`<div style="margin-left: 20px; text-align: left;">
        <p>已知梨子，蘋果和桔子的重量有以下關係：</p>
        <div style="margin-left: 10px; margin-top: 8px;">
            <div>%s</div>
            <div>%s</div>
            <div>%s</div>
            <div>那麼，每一種水果的重複是多少克</div>
			
        </div>
    </div>`, condition[0], condition[1], condition[2])
}

func (me *QuestionTemplate616_4) GetKey() int {
	return hashHelper.HashInt(me.pear, me.apple, me.orange)
}

func NewQuestionTemplate616_5() subjects.IQuestionGenerator {
	return &QuestionTemplate616_5{}
}

type QuestionTemplate616_5 struct {
	people int
}

func (me *QuestionTemplate616_5) RandomData() {
	me.people = rand.Intn(4) + 2

}

func (me *QuestionTemplate616_5) Generate() string {
	namePool := []string{"小明", "小红", "小刚", "小华", "小丽", "小强", "小美", "小东", "小西", "小南", "小北"}
	nameIndex := rand.Perm(len(namePool))
	title := []string{}
	title = append(title, "")
	for i := 0; i < me.people-1; i++ {
		title[0] = title[0] + namePool[nameIndex[i]] + "、"
	}
	title[0] = title[0] + "和" + namePool[nameIndex[me.people-1]] + "去买同一个产品"

	title = append(title, "")
	title[1] = fmt.Sprint("買一個分別欠")
	for i := 0; i < me.people-1; i++ {
		title[1] = title[1] + fmt.Sprintf("%d元、", rand.Intn(5)+1)
	}
	title[1] = title[1] + fmt.Sprintf("和%d元", rand.Intn(5)+1)

	title = append(title, "他們合資買%d個產品")

	return strings.Join(title, "")
}

func (me *QuestionTemplate616_5) GetKey() int {
	return hashHelper.HashInt(me.people)
}
