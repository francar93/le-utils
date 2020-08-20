import {CommonUtils} from "./CommonUtils";
import * as FileSaver from 'file-saver';

export class FileUtils {
    static downloadFile(docObject: any, fileName: string, type: string = null): void {
        try {
            let blob = CommonUtils.getBlob(docObject, type);
            FileSaver.saveAs(blob, fileName);
        } catch (e) {
            console.error(e)
        }
    }
}
