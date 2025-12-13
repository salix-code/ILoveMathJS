package questions

import (
	"fmt"
	"math/rand"
)

func init() {
	qt := GetQuestionTemplate()
	qt.RegisterTemplate(5, 12, 1, new(QuestionTemplate512_1))
	qt.RegisterTemplate(5, 12, 2, new(QuestionTemplate512_2))
	qt.RegisterTemplate(5, 12, 3, new(QuestionTemplate512_3))
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

type QuestionTemplate512_2 struct {
	mode      int
	speed     int
	people    int
	hours     int
	askPeople int
	askHours  int
}

func (me *QuestionTemplate512_2) randomData() {
	me.mode = rand.Intn(3)
	me.speed = rand.Intn(25) + 5  // 加工速度在5到30之间
	me.people = rand.Intn(6) + 4  // 工人数在4到10之间
	me.hours = rand.Intn(11) + 10 // 工作时间在10到20之间

	me.askPeople = me.people + rand.Intn(6) + 4 // 询问的工人数在4到10之间
	me.askHours = me.hours + rand.Intn(11) + 8  //

}

func (me *QuestionTemplate512_2) generateQuestion() string {
	titlePool := [][4]string{
		{"已知工人%d人，工作%d小时能加工%d个零件", "，那么工人%d人，工作%d小时能加工多少个零件？", ",那么工人%d人，工作多少小时能加工%d个零件？", ",那么工作%d小时，需要工人多少人能加工%d个零件"},
		{"%d个人修路%d小时可以修%d米，按这样算", "%d人修%d小时，能修改多少米", "%d人要修%d米的路，需要多少时间", "%d小时要修%d米的路，需要多少人"},
	}

	titleIndex := rand.Intn(len(titlePool))
	title := fmt.Sprintf(titlePool[titleIndex][0], me.people, me.hours, me.people*me.hours*me.speed)

	switch me.mode {
	case 0:
		title += fmt.Sprintf(titlePool[titleIndex][1], me.askPeople, me.askHours)
	case 1:
		title += fmt.Sprintf(titlePool[titleIndex][2], me.askPeople, me.askHours*me.speed*me.askPeople)
	default:
		title += fmt.Sprintf(titlePool[titleIndex][3], me.askHours, me.askHours*me.speed*me.askPeople)
	}
	return title

}

func (me *QuestionTemplate512_2) getKey() int {
	return hashHelper.HashInt(me.speed, me.people, me.hours, me.askPeople, me.askHours)
}

type QuestionTemplate512_3 struct {
	speed   [2]int
	hour    int
	askHour int
}

func (me *QuestionTemplate512_3) randomData() {
	me.speed[0] = rand.Intn(100) + 100
	me.speed[1] = me.speed[0] + (rand.Intn(20)+1)*(rand.Intn(2)*2-1)
	me.hour = rand.Intn(5) + 2
	me.askHour = me.hour + rand.Intn(5) + 2
}

func (me *QuestionTemplate512_3) generateQuestion() string {
	titlePool := [][2]string{
		{"甲和乙两个人打字，%d小时一共打了%d个字，现在两人同时工作，在相同的时间内", "甲打了%d个字，乙打了%d个字，那么他们各自的打字速度是多少个字每小时？"},
		{"甲和乙两个班叠千纸鹤，%d小时一共叠了%d个鹤，现在同时开始，在相同的时间内", "甲叠了%d个鹤，乙叠了%d个鹤，那么他们各自的叠纸速度是多少个纸鹤每小时？"},
	}
	titleIndex := rand.Intn(len(titlePool))
	title := fmt.Sprintf(titlePool[titleIndex][0], me.hour, (me.speed[0]+me.speed[1])*me.hour)
	title = fmt.Sprintf(titlePool[titleIndex][1], me.speed[0]*me.askHour, me.speed[1]*me.askHour)
	return title
}

func (me *QuestionTemplate512_3) getKey() int {
	return hashHelper.HashInt(me.speed[0], me.speed[1], me.hour, me.askHour)
}

type QuestionTemplate512_4 struct {
	speed            int
	people           int
	days             int
	currentDay       int
	askForLeaveCount int
	askForLeaveDays  int
}

func (me *QuestionTemplate512_4) randomData() {
	me.speed = rand.Intn(60) + 10
	me.people = rand.Intn(3) + 4
	me.currentDay = rand.Intn(6) + 5
	me.days = me.currentDay * (rand.Intn(4) + 2)
	me.askForLeaveCount = rand.Intn(2) + 1
	me.askForLeaveDays = rand.Intn(3) + 1
}

func (me *QuestionTemplate512_4) generateQuestion() string {
	titlePool := []string{"%d工人计划加工%d个零件,前%d天有%d个工人请假%d天,结果只完成%d个零件，如果后面无人请假，问还需要多少天才能完成任务？"}

	titleIndex := rand.Intn(len(titlePool))
	total := me.speed * me.people * me.days
	current := me.speed * (me.people*me.currentDay - me.askForLeaveCount*me.askForLeaveDays)

	title := fmt.Sprint(titlePool[titleIndex], me.people, total, me.currentDay, me.askForLeaveCount, me.askForLeaveDays, current)

	return title
}

func (me *QuestionTemplate512_4) getKey() int {
	return hashHelper.HashInt(me.speed, me.people, me.askForLeaveCount, me.askForLeaveDays)
}
