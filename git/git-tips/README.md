#### 一些git的小tips

* 刚刚commit还没有push，发现一个bug，改了再commit吗，怎样做到将改正放到上一次的commit里 ？

```
    修改这个文件如app.js
    git add app.js
    git commit --amend

```
<br/>
git commit --amend是生成一个新的commit树节点，来替换刚才生成的commit节点

* 刚刚commit了但是push了，想删除这个commit<br/>

命令：git reset --hard 要回退到的commit的SHA-1校验和

```
    其中HEAD^表示当前commit节点的父节点，即回退到上一个commit
    git reset --hard HEAD^

```

* 