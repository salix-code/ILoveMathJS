package main

import (
    "html/template"
    "math/rand"
    "net/http"
    "strconv"
    "time"

    "github.com/gin-gonic/gin"
    "mymathjs/server/questions"
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
        templateName = "math_5_16.html"
        qs := questions.GenerateMath516Questions(subType, count)
        pageData = gin.H{
            "Title":     title,
            "Type":      questionType,
            "Subtype":   subType,
            "Questions": qs,
        }

    case "option2":
        templateName = "template_2.html"
        pageData = gin.H{
            "Title": title,
            "Type":  questionType,
        }

    default:
        c.String(http.StatusNotFound, "未找到对应的题型")
        return
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