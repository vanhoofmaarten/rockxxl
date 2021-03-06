module.exports = {
    processors: ["stylelint-processor-styled-components"],
    extends: [
        "stylelint-config-standard",
        "stylelint-config-styled-components",
    ],
    rules: {
        "indentation": 4,
        "string-quotes": "double",
        "no-duplicate-selectors": true,
        "color-hex-case": "lower",
        "color-hex-length": "long",
        "color-named": "never",
        "selector-combinator-space-after": "always",
        "selector-attribute-quotes": "always",
        "selector-attribute-operator-space-before": "never",
        "selector-attribute-operator-space-after": "never",
        "selector-attribute-brackets-space-inside": "never",
        "declaration-block-trailing-semicolon": "always",
        "declaration-colon-space-before": "never",
        "declaration-colon-space-after": "always",
        "property-no-vendor-prefix": true,
        "value-no-vendor-prefix": true,
        "number-leading-zero": "never",
        "function-url-quotes": "always",
        "font-weight-notation": "numeric",
        "font-family-name-quotes": "always-where-recommended",
        "comment-whitespace-inside": "always",
        "comment-empty-line-before": "always",
        "at-rule-no-vendor-prefix": true,
        "rule-empty-line-before": "always-multi-line",
        "selector-pseudo-element-colon-notation": "single",
        "selector-pseudo-class-parentheses-space-inside": "never",
        "selector-no-vendor-prefix": true,
        "media-feature-range-operator-space-before": "always",
        "media-feature-range-operator-space-after": "always",
        "media-feature-parentheses-space-inside": "never",
        "media-feature-name-no-vendor-prefix": true,
        "media-feature-colon-space-before": "never",
        "media-feature-colon-space-after": "always",
        "declaration-colon-newline-after": null
    }
};
