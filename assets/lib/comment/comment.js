$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    var q = {
        page: 1,
        per_page: 10,
        response_type: "comment"
    }

    initTable()


    // 调用接口渲染表格
    function initTable() {
        $('tbody').html('')
        $.ajax({
            url: 'http://ttapi.research.itcast.cn/mp/v1_0/articles',
            type: 'GET',
            data: q,
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('hmtoken') || ''
            },
            dataFilter: function (res)  {
                res = res.replace(/\"id\": (\d+)/g, '"id":"$1"')
                    // console.log(res);
                return res
            },
            success: function(res) {
                console.log(res);
                $.each(res.data.results, function(i, n) {
                    if (n.comment_status == true) {
                        n.comment_status = "正常"
                    } else {
                        n.comment_status = "关闭"
                    }
                })
                var htmlStr = template('tpl-table', res.data)
                $('tbody').append(htmlStr)
                page(res.data.total_count)
            }
        })
    }

    // 分页
    function page(num) {
        // console.log(num);
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: num, //数据总数，从服务端得到
            limit: q.per_page, //每页显示的条数
            curr: q.page, //起始页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [10, 15, 20, 50],
            jump: function(obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                q.page = obj.curr

                // console.log(obj.limit); //得到每页显示的条数
                q.per_page = obj.limit
                    // console.log(q);
                    //首次不执行
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 点击关闭弹出框
    $('body').on('click', '#close', function() {
        // var num = $('.btnDel').length
        // console.log(num);
        var id = $(this).attr('data-id')

        layer.confirm('确定更改评论状态?', function(index) {
            //do something
            // 利用id调用接口改变评论状态
            $.ajax({
                url: `http://ttapi.research.itcast.cn/mp/v1_0/comments/status?article_id=${id}`,
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('hmtoken') || ''
                },
                contentType: 'application/json',
                data: JSON.stringify({
                    allow_comment: false
                }),
                success: function(res) {
                    layer.msg('更改评论类型成功', { icon: 1 });
                    res.data.allow_comment = true,
                        // $(this).removeClass("layui-btn-danger")
                        initTable()
                }
            })
            layer.close(index)
        })
    })

    $('body').on('click', '#open', function() {
        // var num = $('.btnDel').length
        // console.log(num);
        var id = $(this).attr('data-id')

        layer.confirm('确定更改评论状态?', function(index) {
            //do something
            // 利用id调用接口改变评论状态
            $.ajax({
                url: `http://ttapi.research.itcast.cn/mp/v1_0/comments/status?article_id=${id}`,
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('hmtoken') || ''
                },
                contentType: 'application/json',
                data: JSON.stringify({
                    allow_comment: true
                }),
                success: function(res) {
                    layer.msg('更改评论类型成功', { icon: 1 });
                    res.data.allow_comment = false,
                        // $(this).removeClass("layui-btn-danger")
                        initTable()
                }
            })
            layer.close(index)
        })
    })

    // 点击修改弹出弹出框
    $('body').on('click', '.btnChange', function() {
        index1 = layer.open({
            title: '查看评论',
            type: 1,
            area: ['500px', '250px'],
            content: $('#tpl-edit').html()
        })

        var id = $(this).attr('data-id')
        console.log(id);
        $.ajax({
            url: 'http://ttapi.research.itcast.cn/mp/v1_0/comments',
            type: 'GET',
            contentType: 'application/json',
            // data: JSON.stringify({
            //     allow_comment: true
            // }),
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('hmtoken') || ''
            },
            data: {
                source: id,
                type: 'a'
            },
            success: function(res) {
                console.log(res);
                form.val('form-layui1', res.data)

            }

        })
    })

















    // 点击关闭弹出框
    // $('body').on('click', '.btnDel', function() {
    //     var that = $(this)
    //     var thats = $(this).siblings('.btnDel')
    //         // var num = $('.btnDel').length
    //         // console.log(num);
    //         // var id = $(this).attr('data-id')
    //     console.log($(this));

    //     var a = that.attr('id')
    //     var b = thats.attr('id')
    //     console.log(a);
    //     console.log(b);
    //     layer.confirm('确定更改评论状态?', function(index) {
    //         //do something
    //         if (a === 'close') {
    //             that.hide()
    //             thats.show()
    //             return layer.msg('评论已打开')

    //         } else {
    //             that.hide()
    //             thats.show()
    //             return layer.msg('评论已关闭')
    //         }

    //         layer.close(index)
    //     })
    // })



    // 点击修改弹出弹出框
    // $('body').on('click', '.btnChange', function() {
    //     index1 = layer.open({
    //         title: '查看评论',
    //         type: 1,
    //         area: ['500px', '250px'],
    //         content: $('#tpl-edit').html()
    //     })

    // var id = $(this).attr('data-id')
    // console.log(id);
    // $.ajax({
    //     url: 'http://ttapi.research.itcast.cn/mp/v1_0/comments',
    //     type: 'GET',
    //     headers: {
    //         Authorization: 'Bearer ' + localStorage.getItem('hmtoken') || ''
    //     },
    //     data: {
    //         source: id,
    //         type: 'a'
    //     },
    //     success: function(res) {
    //         console.log(res);
    //     }

    // })
    // })

    // // 点击关闭弹出框
    // $('body').on('click', '.btnDel', function() {
    //     // var num = $('.btnDel').length
    //     // console.log(num);
    //     var id = $(this).attr('data-id')
    //     console.log(id);
    //     layer.confirm('确定更改评论状态?', function(index) {
    //         //do something
    //         // 利用id调用接口改变评论状态
    //         $.ajax({
    //             url: 'http://ttapi.research.itcast.cn/mp/v1_0/comments/status',
    //             method: 'PUT',
    //             headers: {
    //                 Authorization: 'Bearer ' + localStorage.getItem('hmtoken') || ''
    //             },
    //             data: {
    //                 allow_comment: true,
    //                 article_id: id + ''
    //             },
    //             success: function(res) {
    //                 console.log(res);
    //                 // if (num === 1) {
    //                 //     q.pagenum = q.pagenum - 1
    //                 // }
    //                 // initTable()
    //             }
    //         })
    //         layer.close(index)
    //     })
    // })




})