import {CommonUtils} from './CommonUtils';

export class StringUtils {

  static capitalize(str) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

  /**
   * Return the input string with the replace parameter
   *
   * @param {string} msg
   * @param {string | RegExp} placeholder
   * @param {string} value
   * @returns {string}
   */
  static replaceParam(msg: string, placeholder: string | RegExp, value: string): string {
    return msg.replace(placeholder, value);
  }


  /**
   * Return the input string with the replace parameter.
   * NB: The input string need to contain the placeholder in this format: __${XXX}__
   *
   * @param message
   * @param params2Replace
   */
  static replaceAllPlaceholder(message: string, params2Replace: any): string {
    let text = '';
    if (message && params2Replace) {
      text = CommonUtils.assign(message);
      Object.keys((params2Replace)).map((cKey) => {
        let cPlaceHolder = '__${' + cKey + '}__';
        text = StringUtils.replaceParam(text, cPlaceHolder, params2Replace[cKey]);
      });
    }
    return text;
  }

  static getRandHash(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  static getRandString(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  /**
   * Valuta se la stringa input è alfanumerica. Accetta solo cifre e caratteri ascii non accentati.
   * @param {string} inputString
   * @returns {boolean}
   */
  static isAlphaNumSimple(inputString: string): boolean {
    return inputString.match(/^[a-z0-9]+$/i) !== null;
  }

  static validationFiscalCode(cf: string): boolean {
    return (!!cf && !!cf.match(__regex.FISCAL_CODE));
  }

  static validateEmail(email: string): boolean {
    if (!CommonUtils.isVoid(email) && email.length > 0) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }
    return true;
  }

  static getStringEnumValues<E extends Record<keyof E, string>>(e: E): E[keyof E][] {
    return (Object.keys(e) as (keyof E)[]).map(k => e[k]);
  }

  static addTagToText(text: string, subText: string, styles: TagStyle[], replaceSubTex: string = undefined, tagEngine: TagEngine = TagEngine.HTML): string {
    let openingTag = '';
    let closingTag = '';
    styles.forEach((newTag) => {
      openingTag = `${openingTag}${_tagMap[tagEngine][newTag].open}`;
      closingTag = `${_tagMap[tagEngine][newTag].close}${closingTag}`;
    });

    let replaceTex = replaceSubTex == undefined ? subText : replaceSubTex;
    return text.replace(`${openPlaceholder}${subText}${closePlaceholder}`, `${openingTag}${replaceTex}${closingTag}`);
  }

}

export enum TagEngine {
  HTML = 'HTML'
}

export enum TagStyle {
  BOLD = 'BOLD',
  UNDERLINE = 'UNDERLINE',
  BREACK = 'BREACK'
}

export const openPlaceholder = '__${';
export const closePlaceholder = '}$__';

export const _tagMap = {
  [TagEngine.HTML]: {
    [TagStyle.BOLD]: {
      open: '<span class = \'font-weight-bold\'>',
      close: '</span>'
    },
    [TagStyle.UNDERLINE]: {
      open: '<u>',
      close: '</u>'
    },
    [TagStyle.BREACK]: {
      open: '<br>',
      close: ''
    },
  },
};

export const __regex = {
  FISCAL_CODE: /^(?:[A-Z][AEIOU][AEIOUX]|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}(?:[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[15MR][\dLMNP-V]|[26NS][0-8LMNP-U])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM]|[AC-EHLMPR-T][26NS][9V])|(?:[02468LNQSU][048LQU]|[13579MPRTV][26NS])B[26NS][9V])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\dLMNP-V]|[0L][1-9MNP-V]))[A-Z]$/i,
  FISCAL_CODE_PIVA: /^\d{11}$/
};
