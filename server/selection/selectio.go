package selection

import (
	"fmt"
	"mymathjs/server/subjects"

	"github.com/gin-gonic/gin"
)

type SelectionData struct {
	Value string
	Label string
}

func HandleSelection(c *gin.Context) {
	tag := c.DefaultQuery("tag", "")
	subject := subjects.GetMathSubjectsInstance()

	category := subject.FetchCategory(tag)
	var selections []SelectionData
	for _, item := range category {
		selections = append(selections, SelectionData{
			Value: fmt.Sprintf("%s.%d", tag, item.Category),
			Label: item.Title,
		})
	}
	c.HTML(200, "selection.html", gin.H{
		"Selections": selections,
	})
}
