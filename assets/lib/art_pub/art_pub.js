$(function() {
    var form = layui.form
    var layer = layui.layer

    // 初始化富文本编辑器
    initEditor()
    initCate()
        // 定义加载文章频道的方法
    function initCate() {
        $.ajax({
            // if (res.message !== 'OK') {
            //     return layer.msg("获取频道失败");
            // }
            type: 'get',
            url: 'http://ttapi.research.itcast.cn/mp/v1_0/channels',
            success: function(res) {
                // 调用template()函数
                var htmlStr = template('tpl-cate', res.data)
                $('[name = channel]').html(htmlStr)
                form.render()
            }

        })
    }
    // 文件上传
    var closeIndex = null
    $('#image').on('click', function() {
        closeIndex = layer.open({
            type: 1,
            title: false,
            area: ['700px', '500px'],
            content: $('#tpl-img').html(),

        })
        gitAllImg()
        getCollectImg()

    })


    // 获取全部照片
    function gitAllImg() {
        $.ajax({
            url: 'http://ttapi.research.itcast.cn/mp/v1_0/user/images',
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('hmtoken')
            },
            contentType: 'application/json',

            success: function(res) {
                // console.log(res.data);
                var htmlStr = template('allImg', res.data)
                $('#showImage').html(htmlStr)

            }
        })
    }
    // 获取收藏照片
    function getCollectImg() {
        $.ajax({
            url: 'http://ttapi.research.itcast.cn/mp/v1_0/user/images',
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('hmtoken')
            },
            contentType: 'application/json',
            data: {
                collect: true,
                per_page: 10,
            },
            success: function(res) {
                // console.log(res.data);
                var htmlStr = template('collectImg', res.data)
                $('#collectImage').html(htmlStr)
            }
        })
    }
    // 点击上传图片
    $('body').on('click', '#showImage', function() {
        // 模拟人的点击行为
        $('#file').click()

    })
    var fd = null
    $('body').on('change', '#file', function(e) {
        //获取文件列表对象
        var file = e.target.files[0]
        fd = new FormData()
        fd.append('image', file)
            //创建文件流获取文件地址
        var newImgURL = URL.createObjectURL(file)
        console.log(newImgURL);
        //设置图片路径
        $(".cover-left img").prop('src', newImgURL)
            // console.log($("#showImage"));
    })

    $('body').on('click', '#sureBtn2', function() {
        $.ajax({
            type: 'post',
            url: 'http://ttapi.research.itcast.cn/mp/v1_0/user/images',
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('hmtoken')
            },
            data: fd,
            // 不修改 Content-Type 属性，使用 FormData 默认的 Content-Type 值
            contentType: false,
            // 不对 FormData 中的数据进行 url 编码，而是将 FormData 数据原样发送到服务器
            processData: false,
            success: function(res) {
                console.log(res.data.url);
                $(".cover-upload img").prop('src', res.data.url)

                layer.close(closeIndex) //关闭弹窗
            }
        })
    })
    var art_state = 'false'
    $('#saveBtn2').on('click', function() {
        art_state = 'true'
    })
    $('#form_pub').on('submit', function(e) {

        // 获取编辑器内容
        var content = tinyMCE.activeEditor.getContent()
        e.preventDefault() //阻止默认行为

        $.ajax({
            type: 'post',
            url: `http://ttapi.research.itcast.cn/mp/v1_0/articles?draft=${art_state}`,
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('hmtoken'),
                "Content-Type": 'application/json'
            },

            data: JSON.stringify({
                title: $('[name=title]').val(),
                content: content,

                channel_id: $('#cs').val(),
                cover: {
                    type: 1,
                    images: [$(".cover-upload img").prop('src')]
                },

            }),
            success: function(res) {
                if (res.messages !== 'OK') {
                    layer.msg('发布失败')
                }
                layer.msg('发布成功')

            }
        })
    })
})