'这段VBS脚本的主要功能是确保脚本以管理员身份运行，
'并将脚本自身移动到Windows目录下。
'如果脚本不在目标路径，
'它会复制自己到目标路径（Windows目录下的sch.vbs），
'然后删除原脚本文件，并退出当前运行的脚本。
'接着，脚本会检查是否有命令行参数提供，
'如果没有提供参数，则直接退出。
'如果有参数，脚本会根据提供的搜索内容构建一个Bing搜索的URL，
'然后打开默认的浏览器并进行搜索。

' 获取当前脚本的完整路径
Dim currentScriptPath
currentScriptPath = WScript.ScriptFullName

' 获取Windows目录路径
Dim windir
windir = WScript.CreateObject("WScript.Shell").ExpandEnvironmentStrings("%windir%")

' 构建目标路径
Dim targetPath
targetPath = windir & "\sch.vbs"

' 如果当前脚本不在目标路径，复制脚本并删除源文件
If currentScriptPath <> targetPath Then
    Dim fso
    Set fso = CreateObject("Scripting.FileSystemObject")
    
    ' 复制文件
    fso.CopyFile currentScriptPath, targetPath, True
    
    ' 删除源文件
    fso.DeleteFile currentScriptPath
    
    ' 退出当前脚本
    WScript.Quit
End If

' 检查当前脚本是否以管理员身份运行
If Not IsAdmin() Then
    ' 如果不是管理员，重新以管理员身份运行
    Dim shell
    Set shell = CreateObject("Shell.Application")
    shell.ShellExecute "wscript.exe", """" & currentScriptPath & """", "", "runas", 1
    WScript.Quit
End If

' 检查命令行参数是否被提供
If WScript.Arguments.Count = 0 Then
    'MsgBox "请提供要搜索的内容作为命令行参数。", vbExclamation, "参数错误"
    WScript.Quit
End If

' 获取用户输入的搜索内容
Dim searchQuery
searchQuery = WScript.Arguments(0)

' 创建URL
Dim url
url = "https://www.bing.com/search?q=" & searchQuery

' 创建WScript.Shell对象
Set shell = WScript.CreateObject("WScript.Shell")

' 打开默认浏览器并进行搜索
shell.Run url

' 检查是否以管理员身份运行的函数
Function IsAdmin()
    Dim wshShell
    Set wshShell = CreateObject("WScript.Shell")
    On Error Resume Next
    ' 尝试执行需要管理员权限的操作
    wshShell.Popup "success", 1, "success", 0 + 32
    IsAdmin = (Err.Number = 0) ' 如果没有错误，则是管理员
    On Error GoTo 0
End Function
