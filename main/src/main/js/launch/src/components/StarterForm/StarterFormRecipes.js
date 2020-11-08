import _ from 'lodash'

//----------------------------------------------------------
// Recipes for automatically shifting from one setting
// to another given the value is untouched.
// TODO: Update Micronaut Starter Api to return values for this
//-------------------------------------------------------
export const LOCAL_RECIPES = {
    lang: {
        KOTLIN: { testFw: "KOTEST", build: "GRADLE_KOTLIN"},
        JAVA: { testFw: "JUNIT", build: "GRADLE"},
        GROOVY: { testFw: "SPOCK", build: "GRADLE"},
    },

    testFw: {
        KOTEST: { lang: "KOTLIN", build: "GRADLE_KOTLIN"},
        JUNIT: { lang: "JAVA", build: "GRADLE"},
    },

    build: {
        GRADLE_KOTLIN: { lang: "KOTLIN", testFw: "KOTEST"},
    }
}

export const recipeSpreader = (recipes) => (key, value, touched) => {
    const spread = {[key] : value.replace(/[^a-z\d.\-_]/gi, "")}
    const recipe = _.get(recipes, [key, value])
    if(recipe) {
        Object.keys(recipe).forEach(aKey=>{
            if(touched[aKey] !== true) {
                spread[aKey] = recipe[aKey]
            }
        })
    }
    touched[key] = true
    return spread
}
