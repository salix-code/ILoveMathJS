package questions

func init() {
	qt := GetQuestionTemplate()
	qt.RegisterTemplate(5, 13, new(QuestionTemplate513_1))
}

type QuestionTemplate513_1 struct {
}

func (me *QuestionTemplate513_1) randomData() {}

func (me *QuestionTemplate513_1) generateQuestion() string {
	return ""
}

func (me *QuestionTemplate513_1) getID() int {
	return 1
}
