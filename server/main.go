package main

import (
	"html/template"
	"math/rand"
	"net/http"
	"strconv"
	"strings"
	"time"

	"mymathjs/server/examination"
	"mymathjs/server/questions"
	"mymathjs/server/selection"
	"mymathjs/server/subjects"

	"github.com/gin-gonic/gin"
)

func main() {
	rand.Seed(time.Now().UnixNano())
	r := gin.Default()

	r.SetFuncMap(template.FuncMap{
		"iterate": func(count int) []int {
			result := make([]int, count)
			for i := range result {
				result[i] = i
			}
			return result
		},
	})

	r.Static("/static", "./static")
	r.LoadHTMLGlob("html/*")

	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})

	r.GET("/page", handlePageRequest)
	r.GET("/math", subjects.HandleMathPage)
	r.GET("/selection", selection.HandleSelection)
	r.GET("/examination", examination.HandleExaminationPage)
	r.GET("/api/generate/", generateQuestions)
	r.GET("/api/examination", examination.HandleCreateQuestion)
	r.POST("/api/examination", examination.HandleApiSubmitExamination)
	r.Run(":8080")
}

func handlePageRequest(c *gin.Context) {
	questionType := c.Query("type")
	subType := c.DefaultQuery("subtype", "type1")
	title := c.Query("title")
	count, _ := strconv.Atoi(c.DefaultQuery("count", "10"))

	var templateName string
	var pageData gin.H

	switch questionType {
	case "math_5_16":
		templateName = "page.html"
		qs := questions.GenerateMath516Questions(subType, count)
		pageData = gin.H{
			"Title":     title,
			"Type":      questionType,
			"Subtype":   subType,
			"Questions": qs,
		}

	default:
		break

	}

	c.HTML(http.StatusOK, templateName, pageData)
}

func generateQuestions(c *gin.Context) {
	question := c.Query("selection")
	lastDotIndex := strings.LastIndex(question, ".")
	if lastDotIndex == -1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid format"})
		return
	}
	tag := question[:lastDotIndex]

	categoryStr := question[lastDotIndex+1:]
	category, err := strconv.Atoi(categoryStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category"})
		return
	}
	qs := questions.GenerateQuestions(tag, category, 10)
	c.JSON(http.StatusOK, qs)
}
