$(function() {
    // var layer = layui.layer
    var form = layui.form
    var q = {
        page: 1, //页数，默认是 1
        per_page: 20, //每页数量，默认每页 10 条
    }
    initTable()
    listSelect()
        // 渲染数据
    function initTable() {
        $.ajax({
            url: 'http://ttapi.research.itcast.cn/mp/v1_0/articles',
            method: 'GET',
            data: q,
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('hmtoken')
            },
            success: function(res) {
                // if (res.status !== 200) {
                //     return layer.msg(res.status)
                // }
                $('#tab-sum').html(res.data.total_count) //筛选后的总条数
                console.log(res.data);
                var htmlStr = template('tm-tab', res.data)
                $('tbody').html(htmlStr)

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
                console.log(res);
                var htmlStr = template('tm-list', res.data)
                $('#select-list').html(htmlStr)
                    // 手动调用layui  重新渲染一下
                form.render()
            }
        })
    }
})