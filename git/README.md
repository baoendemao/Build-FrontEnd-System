#### git
* git官网：https://git-scm.com/docs

* 分类
    * CVS => version control system 
    * DCVS => distributed VCS
        * 优点
            * 本地无需联网，在本地进行提交代码和查看历史
            * 本地分步提交代码，不需要每一次都提交到中央仓库
        * 缺点
            * 本地有完整的仓库，占用存储空间
            * 第一次clone速度慢
* 几个名词
    * untracked     未被跟踪
    * staged        已被暂存
    * staging area  暂存区,  git add命令可以将文件放入暂存区
    * remotes/origin/master   其中remotes/origin是远端仓库的名字， master是分支名字
    * commit        将整个git管理的commit看做一棵树，commit看做是树的节点
    * branch        一个branch是commit树中从根节点到叶子节点的其中一个路径
    * HEAD          其中HEAD指的是当前commit的引用。当git commit添加一个新的commit的时候，HEAD会指向一个新的commit。当使用git checkout或者git reset的时候，HEAD也会改变。而对于远程仓库来说，HEAD总是指向master的

* git管理的文件的状态
    * changed / unstaged 已修改
    * staged             暂存区
    * commited           已提交
    * untracked          未被跟踪

* git add 
    * 将改动文件提交到staging area暂存区

* git commit
    * 已经放入暂存区的文件才可以git commit

* 创建一个新的分支  
    * 方法1： git branch 分支名字
    ```
        切换到master分支，在master分支上创建新的分支:
        git branch branch_2

        此时还是在master分支上，需要切换到新创建的分支：
        git checkout branch_2
    ```

    * 方法2： git checkout -b branch_2 <br/>
             集合了方法1的两步操作

* git branch -d 分支名字 或者 git branch -D 分支名字
    * 删除一个分支
    ```

        git push origin -d branch_2 删除远程的branch_2分支

        git branch -d branch_2  如果有没有merge到master的commit，此时删除分支，会失败


        git branch -D branch_2  即使有没有merge到masteer的commit，也可以删除该分支

    ```


    * 删除了这个分支之后，在这个分支上没有比合并到master的commit并不会马上被删除。但是分支已经没了，commit也无法追溯，过一段时间，被删除的commit会被git的GC回收掉

* git log  查看提交历史
```
    commit 5ca2bdxxxxxxxxxxxxxxxxxxx (HEAD -> branch_1, origin/branch_1)
    Author: xxxx
    Date:   xxxx

        commit的信息
```
（1）commit 5ca2bdxxxxxxxxxxxxxxxxxxx 表示：<br/>
commit后面跟的是一个SHA-1校验和，用来指代区分不同的commit
<br/>
（2）HEAD -> branch_1, origin/branch_1 表示：<br/>
HEAD指向的分支
<br/>

* git log -p  查看详细的提交历史，包括git diff的信息

* git log --stat  查看简单的提交历史，git diff信息只会包括修改的文件名

* git show 查看某个commit的改动
    * git show commit的SHA-1校验和

    ```

        git show 5ca2bdxxxxxxxxxxxxxxxxxxx

    ```

    * git show 5ca2bdxxxxxxxxxxxxxxxxxxx 文件名字
    ```

        想查看app.js在某个commit中的改动：
        git show 5ca2bdxxxxxxxxxxxxxxxxxxx  src/app.js 

    ```

* git status
    * 命令输出
    ```
         new file  =>  新文件

         modified  =>  被修改的文件

         Your branch is ahead of 'remotes/origin/master' by 2 commits  => 你的本地仓库已经领先中央仓库两个提交了
    ```

* git checkout branch_1   切换分支
    * 将某个commit作为当前的commit, 并移动HEAD

* git config credential.helper store
    * git明文保存你输入的密码在本地存储，以后不用再输入密码，不安全


* git命令的配置
    * 配置user name
    ```

        git config --global user.name "yourname"

    ```
    * 配置user email
    ```

        git config --global user.email "yourname@yidian-inc.com"

    ```
    * 配置alias别名
    ```

        git config --global alias.co checkout
        git config --global alias.br branch
        git config --global alias.ci commit
        git config --global alias.st status

    ```
* git push
    * git push
    * git push origin branch_1  
        * origin是指的远程仓库
        * branch_1是远程仓库中的分支名字
    * git push和git push origin branch_1的区别
        * 当push本地自己创建的分支的时候，需要手动指定远程仓库和远程分支，即使用后者，不能使用前者git push
        * 可以配置git config 的push，任何情况下，都使用git push来push到origin的同名分支

* git merge的操作
```
    切换到master分支，执行merge分支的操作：
    git checkout master
    git pull
    git merge branch_1

```
<br/>
git merge所做的原理是： 将其他commit子路径合并到当前commit节点，然后生成一个新的commit叶子节点

    
* git diff
    * git diff
    * git diff --staged  暂存区和上一次commit的不同
    * git diff HEAD  和HEAD指向的commit进行对比

* .git文件夹

```

$ ls -a
.               COMMIT_EDITMSG  HEAD            config          hooks           info            objects         refs
..              FETCH_HEAD      ORIG_HEAD       description     index           logs            packed-refs

```

* git产生的冲突
    * 情形
        * git push产生的冲突
        * git merge产生的冲突
    * 放弃解决冲突，想回到merge前
    ```
        git merge --abort

    ```
