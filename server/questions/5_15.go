package questions

import (
	"fmt"
	"math/rand"
	"time"
)

func init() {
	qt := GetQuestionTemplate()
	qt.RegisterTemplate(5, 15, 1, new(QuestionTemplate515_1))
	qt.RegisterTemplate(5, 15, 2, new(QuestionTemplate515_2))
	qt.RegisterTemplate(5, 15, 3, new(QuestionTemplate515_3))
	qt.RegisterTemplate(5, 15, 4, new(QuestionTemplate515_4))
}

type QuestionTemplate515_1 struct {
	arrange []int
	index   int
	cycle   int
}

func (me *QuestionTemplate515_1) randomData() {
	me.cycle = rand.Intn(5) + 3
	count := me.cycle*3 - 2
	me.arrange = make([]int, count)
	for i := 0; i < len(me.arrange); i++ {
		if i < me.cycle {
			me.arrange[i] = rand.Intn(9) + 1
		} else {
			me.arrange[i] = me.arrange[i-me.cycle]
		}
	}
	me.index = rand.Intn(1000) + 20
}

func (me *QuestionTemplate515_1) generateQuestion() string {
	title := "有一系列数按"
	for i, val := range me.arrange {
		if i > 0 {
			title += ", "
		}
		title += string(rune(val + '0'))
	}
	title += "的规律排列,求第"
	title += fmt.Sprintf("%d", me.index)
	title += "个数是多少？"
	return title
}

func (me *QuestionTemplate515_1) getKey() int {
	key := 0
	for _, val := range me.arrange {
		key = key*10 + val
	}
	return key
}

type QuestionTemplate515_2 struct {
	year         int
	month        int
	day          int
	weekday      int
	askDaysAfter int
	askYear      int
	askMonth     int
	askDay       int
}

func (me *QuestionTemplate515_2) randomData() {
	// 随机生成已知日期（2020-2030年）
	me.year = rand.Intn(10) + 2020
	me.month = rand.Intn(12) + 1

	// 根据月份确定天数
	daysInMonth := 28
	switch me.month {
	case 1, 3, 5, 7, 8, 10, 12:
		daysInMonth = 31
	case 4, 6, 9, 11:
		daysInMonth = 30
	case 2:
		// 判断闰年
		if me.year%4 == 0 && (me.year%100 != 0 || me.year%400 == 0) {
			daysInMonth = 29
		} else {
			daysInMonth = 28
		}
	}
	me.day = rand.Intn(daysInMonth) + 1

	// 计算该日期是星期几
	knownDate := time.Date(me.year, time.Month(me.month), me.day, 0, 0, 0, 0, time.UTC)
	me.weekday = int(knownDate.Weekday())

	// 随机生成要问的日期（在已知日期后的30-90天内）
	me.askDaysAfter = rand.Intn(60) + 300
	askDate := knownDate.AddDate(0, 0, me.askDaysAfter)
	me.askYear = askDate.Year()
	me.askMonth = int(askDate.Month())
	me.askDay = askDate.Day()
}

func (me *QuestionTemplate515_2) generateQuestion() string {
	weekdayNames := []string{"星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"}

	return fmt.Sprintf("已知%d年%d月%d日是%s，那么%d年%d月%d日是星期几？",
		me.year, me.month, me.day, weekdayNames[me.weekday],
		me.askYear, me.askMonth, me.askDay)
}

func (me *QuestionTemplate515_2) getKey() int {
	// 使用日期作为唯一键
	return me.year*10000 + me.month*100 + me.day
}

type QuestionTemplate515_3 struct {
	number int
	coins  [3]int
}

func (me *QuestionTemplate515_3) randomData() {
	me.number = rand.Intn(200) + 100
	me.coins[0] = rand.Intn(5) + 1
	me.coins[1] = rand.Intn(5) + 1
	me.coins[2] = rand.Intn(5) + 1
}

func (me *QuestionTemplate515_3) generateQuestion() string {
	title := "田田有%d枚硬幣，按%d枚1分, %d枚2分，%d枚5分的方式排列，問：最後一枚是幾分，總共多少錢？"
	title = fmt.Sprintf(title, me.number, me.coins[0], me.coins[1], me.coins[2])
	return title
}

func (me *QuestionTemplate515_3) getKey() int {
	return hashHelper.HashInt(me.number, me.coins)
}

type QuestionTemplate515_4 struct {
	index     int
	textLines [2]string
}

func (me *QuestionTemplate515_4) randomData() {
	me.index = rand.Intn(500) + 100

	// 随机生成文字行（可以自定义）
	textGroups := []string{
		"甲乙丙丁戊己庚辛壬癸",
		"天地玄黄宇宙洪荒日月盈昃辰宿列张",
		"一二三四五六七八九十",
		"红绿蓝黄紫橙青白黑灰金银铜铁",
	}
	index := rand.Intn(len(textGroups))
	chosen := []rune(textGroups[index])
	cycle := rand.Intn(len(chosen)-4) + 4
	me.textLines[0] = string(chosen[:cycle])
	groupNum := len(textGroups)
	chosen = []rune(textGroups[(index+rand.Intn(groupNum-1)+1)%groupNum])
	secondCycle := rand.Intn(len(chosen)-4) + 4
	for secondCycle == cycle {
		secondCycle = rand.Intn(len(chosen)-4) + 4
	}
	me.textLines[1] = string(chosen[:secondCycle])

}

func (me *QuestionTemplate515_4) generateQuestion() string {
	// 找到最长的字符串长度
	maxLen := 0
	for _, line := range me.textLines {
		if len([]rune(line)) > maxLen {
			maxLen = len([]rune(line))
		}
	}
	maxLen = maxLen*2 + 2

	// 将每行文字重复填充到相同长度
	alignedLines := [2]string{}
	for i, line := range me.textLines {
		runes := []rune(line)
		lineLen := len(runes)
		if lineLen == 0 {
			continue
		}

		// 计算需要重复多少次才能达到 maxLen
		result := ""
		for len([]rune(result)) < maxLen {
			for _, r := range runes {
				result += string(r)
				if len([]rune(result)) >= maxLen {
					break
				}
			}
		}
		alignedLines[i] = result
	}

	return fmt.Sprintf(`<div style="margin-left: 20px; text-align: left;">
        <p>下面文字中，上下两个一组，问第%d组是什么？</p>
        <div style="margin-left: 10px; margin-top: 8px;">
            <div>%s</div>
            <div>%s</div>
        </div>
    </div>`, me.index, alignedLines[0], alignedLines[1])
}

func (me *QuestionTemplate515_4) getKey() int {
	return hashHelper.HashInt(me.index, me.textLines)
}
