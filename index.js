const fs = require('fs');
const path = require('path');
const request = require('request');
const util = require('util');
const fileType = require('file-type');
// request.debug = true;
const settings = require('./settings.json');
const debug = require('debug');
const parseUrl = settings.url;
// https 请求
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const headers = {
  'cache-control': 'no-cache',
  'content-type': 'multipart/form-data'
}

const requestWrap = ({
  url = parseUrl.balance,
  filePath
}) => {
  const options = {
    method: 'POST',
    url: url,
    headers: headers,
    formData: { secret_key: settings.secret_key }
  };

  if (filePath) {
    options.formData.resume = fs.createReadStream(filePath);
  }

  return new Promise((rs,rj)=>{
    request(options,(error, response, body) => {
      if (error) return rj(error);
      let result;
      try {
        result = JSON.parse(body);
      } catch (e) {
        result = {
          err: e,
          code: 404,
        };
      }
      debug("request body",result);
      return rs(result);
    });
  })
}


const fetchBalance = function () {
  return requestWrap({ url : parseUrl.balance });
}

const checkFileTypeReturnUrl = async(filePath) =>{
  let fd = await util.promisify(fs.open)(filePath,'r');
  let buffer = new Buffer(10)
  let header = await util.promisify(fs.read)(fd,buffer, 0, 10, 0);
  await util.promisify(fs.close)(fd);
  let type = (fileType(buffer) || {}).mime;
  debug('filetype:',type)
  if(!type){
    throw Error(`File type is not found. filename: ${filePath}`);
  }
  // 目前支持格式为jpeg, jpg, gif, png, bmp
  let imageTypes = [
    'image/jpeg',
    'image/gif',
    'image/png',
    'image/bmp'
  ];
  // 目前支持格式为doc, docx, xls, xlsx, mht, html, htm, txt, pdf, rtf, eml, wps, xml, dotx, msg
  // mht eml wps dotx msg 的文件的mimeType 暂时没有加进去
  let docxTypes = [
    'application/msword',
    'application/x-msi',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/html',
    'text/plain',
    'application/pdf',
    'application/rtf',
    'application/xml',
    'application/zip',//临时
  ]

  if(imageTypes.includes(type)){
    return parseUrl.image;
  }

  if(docxTypes.includes(type)){
    return parseUrl.text;
  }

  throw Error(`File type is not supported. filetype: ${type}`);
}

const resumeParse = async( filePath ) => {
  fs.statSync(filePath);
  let postUrl = await checkFileTypeReturnUrl(filePath);
  debug('postUrl:', postUrl);
  return requestWrap({ 
    url : postUrl,
    filePath,
  });
}

module.exports = {
  fetchBalance,
  resumeParse,
}



