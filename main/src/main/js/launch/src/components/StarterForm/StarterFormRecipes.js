import _ from 'lodash'

//----------------------------------------------------------
// Recipes for automatically shifting from one setting
// to another given the value is untouched.
// TODO: Update Micronaut Starter Api to return values for this
//-------------------------------------------------------
export const LOCAL_RECIPES = {
    lang: {
        KOTLIN: { test: "KOTEST", build: "GRADLE_KOTLIN" },
        JAVA: { test: "JUNIT", build: "GRADLE" },
        GROOVY: { test: "SPOCK", build: "GRADLE" },
    },

    test: {
        KOTEST: { lang: "KOTLIN", build: "GRADLE_KOTLIN" },
        JUNIT: { lang: "JAVA", build: "GRADLE" },
    },

    build: {
        GRADLE_KOTLIN: { lang: "KOTLIN", test: "KOTEST" },
    }
}

export const recipeSpreader = (recipes) => (key, value, touched) => {
    const spread = {
        [key]: value.replace(/[^a-z\d.\-_]/gi, "")
    }
    const recipe = _.get(recipes, [key, value])
    if (recipe) {
        Object.keys(recipe).forEach(aKey => {
            if (touched[aKey] !== true) {
                spread[aKey] = recipe[aKey]
            }
        })
    }
    touched[key] = true
    return spread
}
