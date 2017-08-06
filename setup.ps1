#setup new repo in /public before deploy to emilyytlin.github.io
Remove-Item "public" -Force -Recurse -ErrorAction Ignore
New-Item "public" -type directory
git -C public init
git -C public remote add origin https://github.com/emilyytlin/emilyytlin.github.io.git
git -C public pull origin master