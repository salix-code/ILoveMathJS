package examination

import (
	"html/template"
	"math/rand"
	"sync"
)

type FExamination struct {
	Content template.HTML `json:"content"` // 使用 template.HTML 类型
	Answer  string        `json:"answer"`
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
	tag string
}

type FExaminationManager struct {
	sessions map[string]*FExaminationSession
}

var (
	manager *FExaminationManager
	once    sync.Once
)

func Get() *FExaminationManager {
	once.Do(func() {
		manager = &FExaminationManager{}
	})
	return manager
}

func HandleCreateExaminationSession(tag string) {

	name := randomString(16)
	session := &FExaminationSession{}
	Get().sessions[name] = session
	session.tag = tag

}

func HandleExamination(tag string, name string) interface{} {
	item := FExamination{}
	if name == "" {
		name = randomString(16)
	}
	session, exists := Get().sessions[name]
	if !exists {
		session = &FExaminationSession{}
		Get().sessions[name] = session
	}

	return item
}
