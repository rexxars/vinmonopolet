'use strict';

module.exports = function setProps(instance, row, map) {
    var keys = Object.keys(row);

    keys.forEach(function(key) {
        var def = map[key];

        // Skip unknown columns and columns marked as skip
        if (!def || def.skip) {
            return;
        }

        // Apply any defined filter and set to the model as prop
        var value = def.filter ? def.filter(row[key], row) : row[key];
        instance[def.name || key] = value;
    });
};
