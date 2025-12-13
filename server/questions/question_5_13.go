package questions

func init() {
	qt := GetQuestionTemplate()
	qt.RegisterTemplate(5, 13, 1, new(QuestionTemplate513_1))
}

type QuestionTemplate513_1 struct {
	apple  int
	orange int
}

func (me *QuestionTemplate513_1) randomData() {}

func (me *QuestionTemplate513_1) generateQuestion() string {
	return ""
}

func (me *QuestionTemplate513_1) getID() int {
	return 1
}

func (me *QuestionTemplate513_1) getKey() int {
	return 0
}
