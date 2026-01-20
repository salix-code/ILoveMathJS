package subjects

import (
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
)

type SubjectItem struct {
	Tag   string
	Title string
}

type FSubjectItems struct{}

var (
	qt     *FSubjectItems
	qtOnce sync.Once
)

var mathSubjectsInstance = []SubjectItem{
	{Tag: "hebei", Title: "和倍问题"},
	{Tag: "chabei", Title: "差倍问题"},
	{Tag: "hecha", Title: "和差问题"},
	{Tag: "jitutonglong", Title: "鸡兔同笼"},
	{Tag: "zhishu", Title: "植树问题"},
	{Tag: "zhuiji", Title: "追及问题"},
	{Tag: "xiangyu", Title: "相遇问题"},
	{Tag: "yingkui", Title: "盈亏问题"},
}

func HandleMathPage(c *gin.Context) {
	c.HTML(http.StatusOK, "math.html", gin.H{
		"Subject": "math",
		"Items":   mathSubjectsInstance,
	})
}
