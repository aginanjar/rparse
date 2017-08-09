// Copyright 2017 Manish Shivanandhan
//
//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at
//
//        http://www.apache.org/licenses/LICENSE-2.0
//
//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.

'use strict';

/* Module dependencies */
const path = require('path');
const fs = require('fs');
const textract = require('textract');

/* Read skills and titles */
const Dict = require('./dictionary.json');
const Skills = Dict.skills;
const Titles = Dict.titles;

/* Parser function */
module.exports = function(filePath, done) {
    textract.fromFileWithPath(filePath, {
        preserveLineBreaks: true
    }, function(err, doc) {
        if (err) {
            console.log(err);
            done(null);
        } else {
            let _raw = doc;
            let _doc = doc.toLowerCase();
            let _mobile = doc.match(/(?:\+\s*\d{2}[\s-]*)?(?:\d[-\s]*){10}/);
            let _email = doc.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/);
            let _val = {
                email: _email ? _email[0] : null,
                phone: _mobile ? _mobile[0] : null,
                skills: Skills.filter(function(skill) {
                    return _doc.includes(skill)
                }),
                titles: Titles.filter(function(title) {
                    return _doc.includes(title)
                }),
                path: filePath,
                raw: _raw
            }
            done(_val);
        }
    })
}
