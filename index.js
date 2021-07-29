var fse = require('fs-extra');

// Liste des styles applicable
var styleList = ['css', 'scss', 'sass'];

// Met le nom du dossier est des fichiers avec 1 maj puis min
var directoryName = 'components/' + process.argv[2][0].toUpperCase() + process.argv[2].slice(1).toLocaleLowerCase();

var style = process.argv[3];

main();

function main() {
    // Si pas de style definie ou le style donnee n'est pas dans la liste des style
    if (style === undefined || !styleList.includes(style)) {
        style = 'css';
    }

    // Si il n'y a pas de nom pour le composant
    if (directoryName === undefined) {
        console.log('Error, you must give a name to your component');
    } else {
        if (checkDirectory()) {
            // Creation du dossier
            createFolder();

            // Nom des fichiers avec le chemin
            let directoryNameSplit = directoryName.split('/')[1];
            let filePath = directoryName + '/' + directoryNameSplit;

            // Creation des fichiers
            generateFiles(filePath, 'vue');
            generateFiles(filePath, style);
            generateFiles(filePath, 'html');
        }
    }
}

// Permet de check si le dossier existe ou non
// Si le dossier existe, check s'il est empty ou non
function checkDirectory() {
    try {
        fse.ensureDirSync(directoryName);
        if (!checkDirectoryFiles()) {
            return false;
        }
    } catch (err) {
        console.log(err);
        return false;
    }
    return true;
}

// Permet de check s'il y a des fichiers ou non dans le dossier
function checkDirectoryFiles() {
    try {
        // Si des fichiers sont present
        if (fse.readdirSync(directoryName).length) {
            console.log('Error, component ' + directoryName + ' already exist, and there is file inside');
            return false;
        }
    } catch (err) {
        console.log(err);
        return false;
    }
    return true;
}

// Method pour creer le dossier
function createFolder() {
    fse.ensureDir(directoryName)
        .then(() => {
            console.log('Directory created');
        })
        .catch(err => {
            console.log(err);
        });
}

// Methode pour creer un fichier
function generateFiles(filePath, type) {
    fse.ensureFile(filePath + '.' + type)
        .then(() => {
            console.log('Creation of ' + type + ' file');
            // Ecriture dans le fichier
            writeIntoFile(filePath, type)
        })
        .catch((err) => {
            console.log(err);
        });
}

// Methode pour ecrire dans les fichiers
function writeIntoFile(fileNamePath, type) {
    fse.writeFile(fileNamePath + '.' + type, generateTemplate(fileNamePath, type), 'utf8')
        .then(() => {
            console.log('Succesfully write into ' + fileNamePath + '.' + type);
        })
        .catch(err => {
            console.log(err);
        })
}

// Methode pour genere la data a ecrire dans les fichiers
function generateTemplate(fileNamePath, type) {
    // Permet de recuperer juste le nom du fichier
    let fileName = fileNamePath.split('/');
    fileName = fileName[fileName.length - 1];

    switch (type) {
        case ('vue'):
            return '<template src="./' + fileName + '.html"></template>' +
                '\n\n<style scoped src="./' + fileName + '.' + style + '" lang="' + style + '"></style>' +
                '\n\n<script>' +
                '\n\texport default {' +
                '\n\t\tname : \'' + fileName + '\',' +
                '\n\t};' +
                '\n</script>'
        case ('html'):
            return fileName + ' component work !';
        default:
            return '';
    }
}