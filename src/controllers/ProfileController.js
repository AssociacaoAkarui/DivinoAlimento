const Profile = require('../model/Profile')

module.exports =  {
    index(req, res) {
        return res.render("profile", { profile: Profile.get() })
    },

    update(req, res) {
        // req.body para pegar os dados
        const data = req.body

        //definir quanta semanas tem num ano: 52
        const weeksPerYear = 52

        //remover as semanas de férias do ano, pegar quantas semanas tem em 1 mês
        const weeksPerMonth = (weeksPerYear -data["vacation-per-year"]) / 12

        // total de horas trabalhadas na semana
        const weekTotalHours = data["hours-per-day"] * data["days-per-week"]

        // horas trabalhados no mês
        const monthlyTotalHours = weekTotalHours * weeksPerMonth

        // qual será o valor da minha hora?
        const valueHour = data["monthly-budget"] / monthlyTotalHours

        Profile.update({
            ...Profile.get(),
            ...req.body,
            "value-hour": valueHour
        })

        return res.redirect('/profile')
    }
}