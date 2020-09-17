$(function() {

    var layer = layui.layer
    var laypage = layui.laypage;
    var q = {
        page: 1, //当前的页码值 默认的的初始页面
        per_page: 20, //每页显示的条数 设置默认为20
    }

    initTable()

    function initTable() {
        $.ajax({
            url: 'http://ttapi.research.itcast.cn/mp/v1_0/user/images',
            type: 'GET',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('hmtoken')
            },
            data: q,
            success: function(res) {
                // console.log(res);
                var htmlStr = template('material-pic', res.data)
                $('.box3').html(htmlStr)
                    // if (total == 0) {
                    //     renderPage(res.data.total_count)
                    // }
                renderPage(res.data.total_count)

            }
        })
    }



    // 获取后台数据
    $('.btn2').on('click', function() {
        shoucang()
    })


    function shoucang() {
        // var query = '';
        // if (page && pageCount) {
        //     query = '?page=' + page + '&&per_page=' + pageCount;
        // }
        q.collect = true
        $.ajax({
            url: 'http://ttapi.research.itcast.cn/mp/v1_0/user/images',
            type: 'GET',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('hmtoken')
            },
            data: q,
            success: function(res) {
                console.log(res);
                var htmlStr = template('material-pic', res.data)
                $('.box4').html(htmlStr)
                    // if (total == 0) {
                    //     renderPage(res.data.total_count)
                    // }

                // renderPage(res)
                renderPage(res.data.total_count)
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
            layout: ['count', 'prev', 'page', 'next', ],
            limits: [10, 20, 30],
            jump: function(obj, first) {
                // console.log(obj.curr);
                // console.log(obj.limit);
                q.page = obj.curr
                q.per_page = obj.limit
                if (!first) {
                    initTable()
                }
            }
        });
    }

    $('#upload-pic-btn').on('click', function() {
        $('#file-pic-ipt').click()

    })

    $('#file-pic-ipt').on('change', function(e) {
        // console.log(e.target.files[0]);
        var fileList = e.target.files[0]
        console.log(fileList);
        var fileImg = new FormData()
        fileImg.append('image', fileList)

        if (fileList.length === 0) {
            return layer.msg('请上传图片')
        }
        $.ajax({
            url: 'http://ttapi.research.itcast.cn/mp/v1_0/user/images',
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('hmtoken')
            },
            contentType: false,
            processData: false,
            data: fileImg,
            success: function(res) {
                console.log(res);

                initTable() // 获取后台数据 并渲染
            }
        })
    })
    $('.btn1').on('click', function() {
        initTable()
    })

    var collect = null
    $('body').on('click', '.star', function() {
        var id = $(this).parent().siblings().attr('data-id')
        var imgId = $(this).attr('is_collected')
            // console.log(imgId);
        if (imgId) {
            collect = false
        } else {
            collect = true
        }
        $.ajax({
            url: `http://ttapi.research.itcast.cn/mp/v1_0/user/images/${id}`,
            method: 'PUT',
            data: JSON.stringify({
                collect: collect
            }),
                  
            headers: {
                "Content-Type": 'application/json',

                "Authorization": 'Bearer ' + localStorage.getItem('hmtoken')
            },
            success: function(res) {
                console.log(res);
                initTable()
            }
        })
    })
    $('body').on('click', '.delete', function() {
        // 图片id
        var id = $(this).parent().siblings().attr('data-id')
        $.ajax({
            url: `http://ttapi.research.itcast.cn/mp/v1_0/user/images/${id}`,
            method: 'DELETE',
            headers: {
                "Content-Type": 'application/json',
                "Authorization": 'Bearer ' + localStorage.getItem('hmtoken')
            },
            success: function(res) {
                // layui.layer.msg("添加收藏成功")
            }
        })
    })

    // var flag = true
    // $('body').on('click', '.layui-icon-rate', function() {
    //         if (flag) {
    //             $(this).addClass('red')
    //             return flag = false
    //         }
    //         if (flag === false) {
    //             $(this).removeClass('red')
    //             return flag = true
    //         }
    //         // console.log(this);
    //     })
    // 点击收藏获取到的图片并隐藏全部的图片
    // $('body').on('click', '.sc', function() {
    //         // $('#layui-col-md2').hide()
    //         $.ajax({
    //             url: `http://ttapi.research.itcast.cn/mp/v1_0/user/images`,
    //             contentType: 'application/json',
    //             method: 'PUT',
    //             data: JSON.stringify({
    //                 collect: true
    //             }),
    //             headers: {
    //                 Authorization: 'Bearer ' + localStorage.getItem('hmtoken')
    //             },
    //             success: function(res) {
    //                 console.log(res);
    //                 var htmlStr = template('Materials_three', res.data)
    //                 $('.layui-row').html(htmlStr)
    //                 renderPage(res.data.total_count)
    //             }
    //         })
    //     })
    //     /**
    //      * 点击删除图标 绑定事件
    //      */
    // $('body').on('click', '.layui-icon-delete', function() {
    //     $.ajax({
    //         url: `http://ttapi.research.itcast.cn/mp/v1_0/user/images/${}`,
    //         method: 'DELETE',
    //         headers: {
    //             Authorization: 'Bearer ' + localStorage.getItem('hmtoken')
    //         },
    //         success: function(res) {
    //             console.log(res);
    //             renderPage(res.data.total_count)
    //         }
    //     })
    // })
})