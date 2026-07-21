registerPackage({

    name: "translate",

    title: "Translator",

    version: "1.0.0",

    commands: {

        translate(args) {

            if (!args.length) {
                return "Usage: translate <text>";
            }

            return "Translation feature coming soon.\n\nInput: " +
                args.join(" ");

        },

        tr(args) {

            if (!args.length) {
                return "Usage: tr <text>";
            }

            return "Translation feature coming soon.\n\nInput: " +
                args.join(" ");

        }

    }

});
