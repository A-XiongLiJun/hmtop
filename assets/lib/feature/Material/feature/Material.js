$(function() {
    var laypage = layui.laypage;
    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        page: 1, // 页码值，默认请求第一页的数据
        per_page: 8, // 每页显示几条数据，默认每页显示2条
    }
    var total = 0;
    $('.layui-btn-normal ').on('click', function() {
        $(this).addClass('layui-btn-normal').siblings().removeClass('layui-btn-normal')
    })
    $('.layui-btn-primary').on('click', function() {
        $(this).addClass('layui-btn-normal').siblings().removeClass('layui-btn-normal')
    })
    initTable(q.page, q.per_page)

    function initTable(page, pageCount) {
        var query = '';
        if (page && pageCount) {
            query = '?page=' + page + '&&per_page=' + pageCount;
        }
        $.ajax({
            url: 'http://ttapi.research.itcast.cn/mp/v1_0/user/images' + query,
            type: 'GET',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('hmtoken')
            },
            success: function(res) {
                console.log(res);
                var htmlStr = template('Material', res.data)
                $('.layui-row').html(htmlStr)
                if (total == 0) {
                    renderPage(res.data.total_count)
                }
            }
        })
    }

    // 渲染分页的方法
    function renderPage(total) {
        // console.log(per_page);
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.per_page, // 每页显示的条数
            curr: q.page,
            layout: ['count', 'prev', 'page', 'next', 'skip'],
            jump: function(obj, first) {
                console.log(obj.curr);
                if (obj.curr != q.page) {
                    q.page = obj.curr
                    q.per_page = obj.limit
                    initTable(q.page, q.per_page)
                }
            }
        });
    }

    $('#test1').on('click', function() {
        $('#file').click()
    })
    $('#file').on('change', function(e) {
        var filelist = e.target.files
        console.log(e);
        if (filelist.length === 0) {
            return layer.msg('请选择照片!')
        }
        // 1.拿到用户选择的文件
        var file = e.target.files[0]
            // 2.将文件，转化为路径
        var imgURL = URL.createObjectURL(file)
            // $image
            //     .cropper('destroy') // 销毁旧的裁剪区域
            //     .attr('src', imgURL) // 重新设置图片路径
            //     .cropper(options) // 重新初始化裁剪区域
    })
})