import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';
const base='3b6e3d6a9ce43abbd3e7b5a88fd68bcd56d67999';
const paths=execFileSync('git',['diff','--name-only',base,'--','src/pages'],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
function semantic(source,path){
 const sf=ts.createSourceFile(path,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 const result=ts.transform(sf,[context=>root=>{
  const visit=node=>{
   if(path==='src/pages/Businesses.tsx' && ts.isJsxAttribute(node) && node.name.getText(sf)==='appliedCertificationFilter') {
    assert.equal(node.initializer?.getText(sf), '{filterStatutCarte}');
    return undefined;
   }
   if(ts.isJsxAttributes(node))return ts.visitEachChild(ts.factory.updateJsxAttributes(node,node.properties.filter(p=>!ts.isJsxAttribute(p)||!['className','style'].includes(p.name.getText(sf)))),visit,context);
   return ts.visitEachChild(node,visit,context);
  };
  return ts.visitNode(root,visit);
 }]);
 const output=ts.createPrinter({removeComments:true}).printFile(result.transformed[0]);result.dispose();return output;
}
test('Every changed public page retains its content, links, queries and handlers',()=>{
 assert.ok(paths.length>=39);
 for(const path of paths){
 const before=execFileSync('git',['show',`${base}:${path}`],{encoding:'utf8'});
 assert.equal(semantic(fs.readFileSync(path,'utf8'),path),semantic(before,path),path);
 }
});
