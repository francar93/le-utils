import * as _ from 'lodash';
import {TCheckAndGetTypes} from "./ECommon";

export class CommonUtils {

    static updateIdenticalProperties<T = any>(obj4update: any, obj2update: T): T {
        let updateKeys: string[] = Object.keys(obj4update);
        // @ts-ignore
        let summaryKeys: string[] = Object.keys(obj2update);

        for (let k of updateKeys) {
            if (summaryKeys.lastIndexOf(k) >= 0) {
                obj2update[k] = obj4update[k];
            }
        }
        return obj2update;
    }

    static getFormTemplateFromObject(obj: Object) {
        const keys = Object.keys(obj);
        const objKeys = {};
        keys.forEach((key) => {
            objKeys[key] = key.toString();
        });
        return objKeys;
    }

    static getRangeArray(end: number, start = 0, step = 1): number[] {
        return _.range(start, end + 1, step);
    }


    /**
     * Ritorna un oggetto contenente le chiavi assegnate da formFromJSON
     * @param {Object} input
     * @param {string} prefix
     * @returns {Object}
     */
    static keysFromJSON(input: Object, prefix = ''): Object {
        let formNames = {};
        const format = (k: string, i = -1) => `${prefix ? prefix + '_' : ''}${k}${i > -1 ? i : ''}`;

        for (let key in input) {
            const innerObj = input[key];
            if (CommonUtils.isObjectPlain(input[key])) {
                formNames = _.assign({}, this.keysFromJSON(input[key], format(key)), formNames);
            } else if (Array.isArray(innerObj)) {

                for (let i = 0; i < innerObj.length; i++) {
                    formNames = _.assign({}, this.keysFromJSON(innerObj[i], format(key, i)), formNames);
                }

            } else {
                formNames[format(key)] = format(key);
            }
        }
        return formNames;
    }


    static isVoid = function (input) {
        return input === 'undefined' || input === undefined || input === null || input === 'null' || input === '' || input === '';
    };

    static isUndefined = function (input) {
        return input === undefined;
    };

    static isVoidObj(obj: any): boolean {
        let control = true;
        if (!CommonUtils.isVoid(obj)) {
            control = Object.keys(obj).reduce((res, k) => res && !(!!obj[k] || obj[k] === false || !isNaN(parseInt(obj[k]))), true);
        }
        return control;
    }

    static getNestedObjectIsEmpty(nestedObj, path): boolean {
        return CommonUtils.isVoid(CommonUtils.getNestedObject(nestedObj, path));
    }

    static getNestedObject(nestedObj, path): any | undefined {
        let pathArr = path.split('.');
        return pathArr.reduce((obj, key) =>
            (obj && !CommonUtils.isVoid(obj[key])) ? obj[key] : undefined, nestedObj);
    }

    static removeDuplicates(myArr, prop) {
        return myArr.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
        });
    }

    static assign(object: any): any {
        return _.cloneDeep(object);
    }

    static objTypeEquals = function (obj1, obj2, lable = '') {
        if (typeof obj1 != typeof obj2) {
            // console.log(`objEquals: obj2 obj1 sono di tipo diverso `);
            return false;
        }
        for (let p in obj1) {

            //Check property exists on both objects
            if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) {
                return false;
            }

            switch (typeof (obj1[p])) {
                //Deep compare objects
                case 'object':
                    // if (!Utils.objTypeEquals(obj1[p], obj2[p], p)) {
                    //     return false;
                    // }
                    break;
                //Compare function code
                //toDo IN CASO IMPLEMENTARE
                case 'function':
                    if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) {
                        return false;
                    }
                    break;
                //Compare values
                default:
                    if (obj1[p] != obj2[p]) {
                        //console.log(`objEquals: ${obj1[p]} != ${obj2[p]}`);
                        return false;
                    }
            }
        }

        //Check object 2 for any extra properties
        for (let p in obj2) {
            if (typeof (obj1[p]) == 'undefined') {
                return false;
            }
        }
        return true;
    };

    static getObjectDiff(obj1, obj2) {
        if (!CommonUtils.isVoidObj(obj1) && !CommonUtils.isVoidObj(obj2)) {
            return Object.keys(obj1).reduce((result, key) => {
                if (!obj2.hasOwnProperty(key)) {
                    result.push(key);
                } else if (_.isEqual(obj1[key], obj2[key])) {
                    const resultKeyIndex = result.indexOf(key);
                    result.splice(resultKeyIndex, 1);
                }
                return result;
            }, Object.keys(obj2));
        } else {
            return [];
        }
    }

    static isObjectChanged(obj1, obj2): boolean {
        let diff = this.getObjectDiff(obj1, obj2);
        return diff.length > 0;
    }

    static getObjectDiffDeap(obj1, obj2) {

        return Object.keys(obj1).reduce((result, key) => {
            if (!obj2.hasOwnProperty(key)) {
                result.push(key);
            } else if (CommonUtils.objTypeEquals(obj1[key], obj2[key], key)) {
                const resultKeyIndex = result.indexOf(key);
                result.splice(resultKeyIndex, 1);
            }
            return result;
        }, Object.keys(obj2));
    }

    /**Funzione per fare unhash di una variabile */
    static formatOBject4Output = function (obj: any): any {
        switch (typeof obj) {

            //Deep compare objects
            case 'object':

                if (Array.isArray(obj)) {
                    let newArray = [];
                    for (let elem of obj) {
                        newArray.push(CommonUtils.formatOBject4Output(elem));
                    }

                    return newArray;
                }

                if (obj === null) {
                    return null;
                }

                let newObj = {};
                for (let k in obj) {
                    // @ts-ignore
                    let newK = k.startsWith('_') ? k.substring(1) : k;
                    if (obj.hasOwnProperty(k) && !CommonUtils.isVoid(obj[k])) {
                        newObj[newK] = CommonUtils.formatOBject4Output(obj[k]);
                    }
                }
                return newObj;
            default:
                return obj;
        }

    };

    static checkAndGet(obj: any, path: string, defaultValue: any = null, type?: TCheckAndGetTypes): any {
        if (path != null) {
            const obj2Return = _.get(obj, path, defaultValue);
            if (!CommonUtils.isVoid(obj2Return)) {
                switch (type) {
                    case 'number':
                        return +obj2Return;
                    case 'string':
                        return obj2Return.toString();
                    default:
                        return obj2Return;
                }
            } else {
                return obj2Return;
            }
        } else {
            return defaultValue;
        }
    }

    static prova() {
        return this.get({var: this.length, path: 'path'}, {var: this.caller, path: 'stocazzo'});

    }

    static get(...args: { var: any, path: string }[]) {

        return args.forEach((value: { var: any, path: string }) => {
            let val = CommonUtils.checkAndGet(value.var, value.path, null);

            if (!CommonUtils.isVoid(val)) {
                return val;
            }
        });

    }

    static base64ToArrayBuffer(base64) {
        let binaryString = window.atob(base64);
        let binaryLen = binaryString.length;
        let bytes = new Uint8Array(binaryLen);

        for (let i = 0; i < binaryLen; i++) {
            let ascii = binaryString.charCodeAt(i);
            bytes[i] = ascii;
        }
        return bytes;
    }

    static getBlob(docObject: any, type: string = null): Blob {
        try {
            let defaultDwType = 'application/pdf';
            let pdfInBase64 = this.base64ToArrayBuffer(docObject);
            return new Blob([pdfInBase64], {type: (type) ? type : defaultDwType});
        } catch (e) {
            console.error(e)
        }
    }

    /**
     * Funzione che permette la visualizzazione di un pdf (all'interno di un iframe incorporato in una nuova scheda del browser).
     * @param docObject
     * @param fileName
     * @param type
     */
    static viewFile(docObject: any, fileName: string, type: string = null): void {
        try {
            // generazione del Blob
            let blob = this.getBlob(docObject, type);
            let url = window.URL.createObjectURL(blob);
            // creazione del titolo della scheda a partire dal nome del file
            let title = document.createElement('title');
            title.appendChild(document.createTextNode(fileName));
            // creazione dell'iframe
            let iframe = document.createElement('iframe');
            iframe.src = url;
            iframe.width = '100%';
            iframe.height = '100%';
            iframe.style.border = 'none';
            // inserimento di iframe e titolo all'interno di una nuova scheda
            let win = window.open();
            win.document.head.appendChild(title);
            win.document.body.appendChild(iframe);
            win.document.body.style.margin = '0';
        } catch (e) {
        }
    }

    /**
     * Riconosce se l'input è un oggetto in senso stretto
     * @param input
     * @returns {boolean} false se non è un oggetto o è un array, true se è un oggetto
     */
    static isObjectPlain(input: any): boolean {
        if (typeof (input) != 'object') {
            return false;
        } else {
            return !(Array.isArray(input));
        }
    }

    static booleanEquality(a: boolean, b: boolean) {
        return (a && b) || (!a && !b);
    }

    /**
     * funzione per rimuovere qualsiasi property di obj che sia void.
     * ?Chiedi a Babbajs per ulteriori info
     * @param obj
     */
    static pruneEmpty(obj) {
        return function prune(current) {
            _.forOwn(current, function (value, key) {
                if (_.isUndefined(value) || _.isNull(value) || _.isNaN(value) ||
                    (_.isString(value) && _.isEmpty(value)) ||
                    (_.isObject(value) && _.isEmpty(prune(value)))) {
                    delete current[key];
                }
            });
            // rimuove ogni rimasuglio di void sugli array
            if (_.isArray(current)) {
                _.pull(current, undefined);
            }

            return current;
        }(_.cloneDeep(obj));  // non modifica l'oggetto originale ma crea un clone
    }


    /**
     * Returns true if the property value is in the object path. False otherwise
     *
     * @param object
     * @param prop
     * @param defaultValue
     */
    static checkExistenceField(object: Object, prop: string, defaultValue: any = undefined): boolean {
        return _.get(object, prop, defaultValue);
    }

    /**
     * Returns true if the property value is in the object path or is empty string. False otherwise
     *
     * @param object
     * @param prop
     */
    static checkExistenceFieldOrString(object: Object, prop: string): boolean {
        let output = _.get(object, prop);
        return !!output || output == '';
    }

    /**
     * Returns hashcode of the input string
     *
     * @param stringToHash
     */
    static hash(stringToHash): string {
        return btoa(unescape(encodeURIComponent(stringToHash)));
    }

    /**
     * Returns unhashcode of the input string
     *
     * @param stringToUnhash
     */
    static unhash(stringToUnhash): any {
        return decodeURIComponent(escape(atob(stringToUnhash)));
    };

    static formatOBject4Table = function (obj: any, keyList: any): any {
        let obj2ret = null;
        if ('object' == typeof obj) {
            if (Array.isArray(obj)) {
                let newArray = [];
                for (let elem of obj) {
                    newArray.push(CommonUtils.formatOBject4Table(elem, []));
                }
                obj2ret = newArray;
            } else {
                let newObj = {};
                keyList.forEach((k) => {
                    if (obj.hasOwnProperty('_' + k)) {
                        newObj[k] = CommonUtils.formatOBject4Table(obj['_' + k], []);
                    }
                });
                obj2ret = newObj;
            }
        } else {
            obj2ret = obj;
        }
        return obj2ret;
    };

    /**
     * Flip between the keys and the values used when you want to have a single map and bidirectionally access the values as if they were keys
     *
     * @param obj
     */
    static objectFlip(obj) {
        return Object.keys(obj).reduce((ret, key) => {
            ret[obj[key]] = key;
            return ret;
        }, {});
    }

    /**
     * Returns true if the variable 'a' is included in the array, if 'a' is an object an objectDiff is thrown on the objects
     *
     * @param array
     * @param a
     * @param compareFunction
     */
    static arrayInclude(array: any[], a: any, compareFunction = null): boolean {
        if (typeof a === 'object') {
            let index = -1;
            if (!!compareFunction) {
                // @ts-ignore
                index = array.findIndex((b) => compareFunction(a, b));
            } else {
                // @ts-ignore
                index = array.findIndex((b) => this.getObjectDiff(a, b).length === 0);
            }
            return index >= 0;
        }
        return array.indexOf(a) >= 0;
    }

    /**
     * Return the list to Input, removing the top element.
     *
     * Complementary function: manageSelectListForIEInput.
     * @param list
     */
    static manageSelectListForIEOutput(list: any[]): any[] {
        if (!!list && list.length > 0) {
            list.shift();
        }
        return list;
    }

    static isObjEmptyOrWithPropEmpty(obj: any): boolean {
        let result = true;
        if (!obj) {
            return result;
        } else {
            for (let prop in obj) {
                if (!CommonUtils.isVoid(obj[prop])) {
                    result = false;
                    return result;
                }
            }
        }
        return result;
    }

}

