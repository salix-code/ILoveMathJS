package questions

import (
    "fmt"
    "math/rand"

    "github.com/gin-gonic/gin"
)

type QuestionTemplate struct{
}


// GenerateMath516Questions 根据 subtype 生成不同变体的鸡兔同笼题目
// subtype 示例： "type1","type2","type3" 等
func GenerateMath516Questions(subtype string, count int) []interface{} {
    qs := make([]interface{}, count)

    for i := 0; i < count; i++ {
        var chicken, rabbit int
        var heads, legs int
        var questionText string

        // 不同 subtype 控制题目生成规则
        switch subtype {
        case "type1":
            // 基础：直接生成 a (chicken) 与 b (rabbit)
            chicken = rand.Intn(8) + 2   // 2-9
            rabbit = rand.Intn(6) + 1    // 1-6
            heads = chicken + rabbit
            legs = 2*chicken + 4*rabbit

            questionText = fmt.Sprintf("已知鸡与兔共有 %d 个头，%d 条腿，问鸡、兔各多少只？", heads, legs)

        case "type2":
            chicken = rand.Intn(12) + 3
            rabbit = rand.Intn(20) + 2
            if rabbit % 2 == 1 {
                rabbit += 1
            }
            heads = chicken + rabbit
            legs = 2*chicken + 3*rabbit
            questionText = fmt.Sprintf("已知三轮车和自行车两种车，一共有%d辆，轮子共有%d个，问三轮车和自行车各多少辆？", heads, legs)

        case "type3":
            chicken = rand.Intn(12) + 3
            rabbit = rand.Intn(20) + 2
            if rabbit % 2 == 0 {
                rabbit += 1
            }
            heads = chicken + rabbit
            legs = 2*chicken + 3*rabbit
            questionText = fmt.Sprintf("已知三轮车和自行车两种车，一共有%d辆，轮子共有%d个，问三轮车和自行车各多少辆？", heads, legs)

        case "type4":
            // 文字复杂表述（相同数值，但表述更复杂）
            chicken = rand.Intn(7) + 2
            rabbit = rand.Intn(6) + 1
            heads = chicken + rabbit
            legs = 2*chicken + 4*rabbit
            questionText = fmt.Sprintf("农场主同时数到 %d 个头与 %d 条腿，若只有鸡与兔两种动物，请问鸡与兔各几只？", heads, legs)

        case "type5":
            // 提高难度：头与腿数据较大
            chicken = rand.Intn(20) + 10
            rabbit = rand.Intn(15) + 5
            heads = chicken + rabbit
            legs = 2*chicken + 4*rabbit
            questionText = fmt.Sprintf("共 %d 个头，%d 条腿，鸡与兔各多少只？（较大数据）", heads, legs)

        default:
            // 默认同 type1
            chicken = rand.Intn(8) + 2
            rabbit = rand.Intn(6) + 1
            heads = chicken + rabbit
            legs = 2*chicken + 4*rabbit
            questionText = fmt.Sprintf("已知鸡与兔共有 %d 个头，%d 条腿，问鸡、兔各多少只？", heads, legs)
        }

        qs[i] = gin.H{
            "number":      i + 1,
            "content":     questionText,
            "type":        "鸡兔同笼",
            "subtype":     subtype,
            "answerLines": 1,
            "answer": gin.H{
                "chicken": chicken,
                "rabbit":  rabbit,
            },
        }
    }

    return qs
}