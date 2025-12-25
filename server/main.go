package main

import (
	"html/template"
	"math/rand"
	"net/http"
	"strconv"
	"strings"
	"time"

	"mymathjs/server/questions"

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
	r.GET("/api/generate/:type", generateQuestions)
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
		templateName = "page.html"
		parts := strings.Split(questionType, "_")
		if len(parts) == 3 {
			chapter, _ := strconv.Atoi(parts[1]) // 5
			section, _ := strconv.Atoi(parts[2]) // 15 或 12

			qs := questions.GenerateQuestions(chapter, section, subType, count)
			pageData = gin.H{
				"Title":     title,
				"Type":      questionType,
				"Subtype":   subType,
				"Questions": qs,
			}
		}

	}

	c.HTML(http.StatusOK, templateName, pageData)
}

func generateQuestions(c *gin.Context) {
	questionType := c.Param("type")
	subType := c.DefaultQuery("subtype", "type1")
	count, _ := strconv.Atoi(c.DefaultQuery("count", "10"))

	var qs []interface{}

	switch questionType {
	case "math_5_16":
		qs = questions.GenerateMath516Questions(subType, count)
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "未知题型"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":   true,
		"type":      questionType,
		"subtype":   subType,
		"questions": qs,
	})
}
