#!/bin/sh
zip -r facepad.jar content/ skin/
mv facepad.jar chrome/facepad.jar
zip photojacker.xpi install.rdf chrome/facepad.jar chrome.manifest
