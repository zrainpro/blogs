# 第一步，（n）代表提交次数
git rebase -i HEAD~n
# 第二步
# 然后按`i`编辑，把`pick` 改成 `edit`，按'Esc'退出编辑，按`:wq`保存退出
# 第三步
git commit --amend --author="作者 <邮箱@xxxx.com>" --no-edit
# 第四步
git rebase --continue
# 第五步
git push --force