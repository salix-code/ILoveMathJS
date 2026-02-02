package examination

import (
	"html/template"
	"math/rand"
	"mymathjs/server/subjects"
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
)

type FExamination struct {
	Content template.HTML `json:"content"` // 使用 template.HTML 类型
	Answer  int           `json:"answer"`
	Id      string        `json:"id"`
}

func init() {

}

const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

func randomString(n int) string {
	b := make([]byte, n)
	for i := range b {
		b[i] = charset[rand.Intn(len(charset))]
	}
	return string(b)
}

type FExaminationSession struct {
	sessionID string
	tag       string
	subject   int
	answers   map[string]int
	total     int
	correct   int
}

type FExaminationManager struct {
	sessions map[string]*FExaminationSession
}

func findExaminationnSessionByID(sessionID string) *FExaminationSession {
	manager := Get()
	for _, session := range manager.sessions {
		if session.sessionID == sessionID {
			return session
		}
	}
	return nil
}

var (
	manager *FExaminationManager
	once    sync.Once
)

func Get() *FExaminationManager {
	once.Do(func() {
		manager = &FExaminationManager{
			sessions: make(map[string]*FExaminationSession),
		}
	})
	return manager
}

func HandleCreateExaminationSession(tag string) {
	name := randomString(16)
	session := &FExaminationSession{tag: tag}
	Get().sessions[name] = session
}

func HandleExamination(tag string, name string) interface{} {
	item := FExamination{}
	if name == "" {
		name = randomString(16)
	}
	session, exists := Get().sessions[name]
	if !exists {
		session = &FExaminationSession{tag: tag}
		Get().sessions[name] = session
	}
	return item
}

func HandleExaminationPage(c *gin.Context) {
	tag := c.DefaultQuery("tag", "")
	deviceId := c.Query("deviceId")
	_, exists := Get().sessions[deviceId]
	if !exists {
		sessionId := randomString(16)
		Get().sessions[deviceId] = &FExaminationSession{tag: tag, sessionID: sessionId}
	}
	session := Get().sessions[deviceId]

	c.HTML(200, "examination.html", gin.H{
		"Session": session.sessionID,
		"Tag":     tag,
	})
}

func HandleCreateQuestion(c *gin.Context) {
	sessionID := c.Query("session")
	userAnswer := c.Query("answer")
	lastQuestionId := c.Query("lastQuestionId")

	session := findExaminationnSessionByID(sessionID)
	examination := FExamination{}

	if session == nil {
		examination.Content = "Invalid session"
		c.JSON(http.StatusBadRequest, examination)
		return
	}

	correctAnswer, exists := session.answers[lastQuestionId]
	if !exists {
		examination.Content = "Invalid answer"
		c.JSON(http.StatusBadRequest, examination)
		return
	}
	if userAnswer == "" {
		examination.Content = "Invalid answer"
		c.JSON(http.StatusBadRequest, examination)
		return
	}

	if correctAnswerStr := string(correctAnswer); correctAnswerStr == userAnswer {
		session.correct++
	}

	if session.total > 5 && float64(session.correct)/float64(session.total) > 0.9 {
		session.subject += 1
		session.total = 0
		session.correct = 0
	}
	session.total++

	tag := session.tag
	subject := session.subject

	qGenerator := subjects.GetMathSubjectsInstance().GetQuestionGenerator(tag, subject)
	if qGenerator == nil {
		examination.Content = "Invalid tag or category"
		c.JSON(http.StatusBadRequest, examination)
		return
	}

	examination.Answer = qGenerator.RandomData()
	examination.Content = template.HTML(qGenerator.Generate())

	c.JSON(http.StatusOK, examination)
}

func HandleApiSubmitExamination(c *gin.Context) {
	c.Status(http.StatusOK)
}
