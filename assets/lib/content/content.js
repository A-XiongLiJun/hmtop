$(function() {
    // var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    var query = {
        // status: null, //文章状态，0-草稿，1-待审核，2-审核通过，3-审核失败，4-已删除，不传为全部
        // channel_id: null, //频道 id，不传为全部
        // begin_pubdate: null, //起始时间
        // end_pubdate: null, //截止时间
        page: 1, //页数，默认是 1
        per_page: 20, //每页数量，默认每页 10 条
        // response_type: '' //返回数据的字段
    }
    initTable()
    listSelect()
        // 渲染数据
    function initTable() {
        $.ajax({
            url: 'http://ttapi.research.itcast.cn/mp/v1_0/articles',
            method: 'GET',
            data: query,
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('hmtoken')
            },
            dataFilter: function (res)  {
              res = res.replace(/\"id\": (\d+)/g,  '"id":"$1"')
                // console.log(res);
                return res
            },
            success: function(res) {
                // if (res.status !== 200) {
                //     return layer.msg(res.status)
                // }
                // console.log(res);
                $('#tab-sum').html(res.data.total_count) //筛选后的总条数
                // console.log(res.data);
                var htmlStr = template('tm-tab', res.data)
                $('tbody').html(htmlStr)
                Next(res.data.total_count)
            }
        })
    }
    // 获取文章频道
    function listSelect() {
        $.ajax({
            url: 'http://ttapi.research.itcast.cn/mp/v1_0/channels',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('hmtoken')
            },
            success: function(res) {
                // console.log(res);
                var htmlStr = template('tm-list', res.data)
                $('#select-list').html(htmlStr)
                    // 手动调用layui  重新渲染一下
                form.render()
            }
        })
    }
    /**
     * 监听radio单选
     */
    form.on('radio(go)', function(data) {
        // console.log(data.elem); //得到radio原始DOM对象
        console.log(data.value); //被点击的radio的value值
        if (data.value == '') {
            delete query.status
            return
        }
        query.status = data.value
    });
    /**
     * 监听select选择
     */
    form.on('select(test)', function(data) {
        // console.log(data.elem); //得到select原始DOM对象
        console.log(data.value); //得到被选中的值
        // console.log(data.othis); //得到美化后的DOM对象
        if (data.value == '') {
            delete query.channel_id
            return
        }
        query.channel_id = data.value
    });
    laydate.render({
            elem: '#test1',
            type: 'datetime', //不选择时间
            range: '-',
            // format: 'yyyy年M月d日H时m分s秒'
            format: 'yyyy年M月d日',
            done: function(value, date, endDate) {
                // console.log(value); //得到日期生成的值，如：2017-08-18
                // console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                // console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
                if (!value) {
                    delete query.begin_pubdate
                    delete query.end_pubdate
                    return
                }
                query.begin_pubdate = date.year + '-' + padZero(date.month) + '-' + padZero(date.date)
                query.end_pubdate = endDate.year + '-' + padZero(endDate.month) + '-' + padZero(endDate.date)
                console.log(query.begin_pubdate);
            }
        })
        // 补零函数
    function padZero(n) {
        return n < 10 ? '0' + n : n
    }
    // 表单提交事件监听
    $('#fr-sub').on('submit', function(e) {
            e.preventDefault()
            initTable()
        })
        // 分页模块
    function Next(num) {
        laypage.render({
            elem: 'Next', //注意，这里的 test1 是 ID，不用加 # 号
            count: num, //数据总数，从服务端得到
            limit: query.per_page, //每页的条数
            curr: query.page, //起始页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [10, 20, 30, 40],
            jump: function(obj, first) {
                // console.log(obj.curr);
                query.page = obj.curr
                if (!first) {
                    query.per_page = obj.limit
                    initTable()
                }
            }
        })
    }

    // 图片数组的过滤器
    template.defaults.imports.dataImg = function(img) {
        if (img.length == 0) {
            return '/assets/images/img/error.gif'
        }
        return img[0]
    }

    // 请求状态过滤
    template.defaults.imports.Success = function(success) {
        if (success == 0) {
            return '草稿'
        } else if (success == 1) {
            return '待审核'
        } else if (success == 2) {
            return '审核通过'
        } else if (success == 3) {
            return '审核失败'
        } else if (success == 4) {
            return '已删除'
        }
    }

    // 编辑事件
    // $('tbody').on('click', '#cell', function() {
    //     location.href = '/content/cell.html'
    // })

    //删除事件
    $('tbody').on('click', '#delete', function() {
        var id = $(this).attr('data-id')
        $.ajax({
            url: `http://ttapi.research.itcast.cn/mp/v1_0/articles/${id}`,
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('hmtoken')
            },
            success: function(res) {
                console.log(res);
                initTable()
            }
        })
    })
})