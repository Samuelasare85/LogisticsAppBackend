const sanitizeHtml = require('sanitize-html');


function htmlSanitizer(value) {
    return sanitizeHtml(value, {
        allowedTags: [],
        allowedAttributes: {},
        allowedIframeHostnames: [],
        disallowedTagsMode: 'discard',
        disallowedAttributes: ['href', 'src'],
        exclusiveFilter: (frame) => {
            return frame.tag === 'a' || frame.tag === 'iframe';
        }
    });
}

module.exports = htmlSanitizer;