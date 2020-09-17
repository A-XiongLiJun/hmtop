$(function () {
  var layer = layui.layer
  var form = layui.form
  xuanranUser()

  /* 创建函数，获取数据，渲染页面 */
  function xuanranUser() {
    //获取数据
    $.ajax({
      url: 'http://ttapi.research.itcast.cn/mp/v1_0/user/profile',
      type: 'GET',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('hmtoken') || ''
      },
      success: function (res) {
        $('#username_name').html(res.data.name)
        $('#username_intro').html(res.data.intro)
        $('#username_id').html(res.data.id)
        $('#username_mobile').html(res.data.mobile)
        $('#username_email').html(res.data.email)
        $('.userinfo img').attr('src', res.data.photo)
        $('#un').val(res.data.name)
        $('#jianjie').val(res.data.intro)
        $('#lfy-email').val(res.data.email)
      }
    })
  }
  $('#changpic-btn').on('click', function () {
    layer.open({
      title: '上传头像',
      content: $('#shangchuan').html(),
      type: 1,
      area: ['960px', '370px'],
      btn: ['确认', '取消'],
      yes: function (index, layero) {
        $.ajax({
          url: 'http://ttapi.research.itcast.cn/mp/v1_0/user/photo',
          method: 'PATCH',
          data: fd,
          // 注意：如果向服务器提交的是 FormData 格式的数据，
          // 必须添加以下两个配置项
          contentType: false,
          processData: false,
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('hmtoken') || ''
          },
          success: function (res) {
            xuanranUser()
            window.parent.xuanrandatouxiang()
          }
        })
        layer.close(index);
      }
    })
  })

  $('#file').on('click', function (e) {
    e.stopPropagation()
  })
  $('body').on('click', '.avatar-uploader', function () {
    $('#file')[0].click()

  })

  $('body').on('change', '#file', function (e) {
    // 获取到文件的列表数组
    var files = e.target.files
    console.log(files);
    // 判断用户是否选择了文件
    if (files.length === 0) {
      return
    }
    fd = new FormData()
    fd.append('photo', files[0])
    newImgURL = URL.createObjectURL(files[0])
    $('.localimg').attr('src', newImgURL).show()
  })

  $('#changename-btn').on('click', function () {
    $('.username .rightcontent').hide()
    $('#gainame').show()
    $.ajax({
      url: 'http://ttapi.research.itcast.cn/mp/v1_0/user/profile',
      type: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('hmtoken') || ''
      },
      success: function (res) {
        console.log(res);
        xuanranUser()
      }
    })

  })
  $('#quxiao_btn').on('click', function () {
    $('.username .rightcontent').show()
    $('#gainame').hide()
  })
  $('#changeemail-btn').on('click', function () {
    $('#email_userinfo .rightcontent').hide()
    $('#gaiemail').show()
    $.ajax({
      url: 'http://ttapi.research.itcast.cn/mp/v1_0/user/profile',
      type: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('hmtoken') || ''
      },
      success: function (res) {
        xuanranUser()
      }
    })
  })
  $('#not_btn').on('click', function () {
    $('#email_userinfo .rightcontent').show()
    $('#gaiemail').hide()
  })

  // $('#baocun').on('click', function (e) {
  //   console.log(1);
  //   e.preventDefault()
  //   var bbb = JSON.stringify(form.val('aaa'))
  //   console.log(bbb);
  //   $.ajax({
  //     type: 'PATCH',
  //     url: 'http://ttapi.research.itcast.cn/mp/v1_0/user/profile',
  //     headers: {
  //       Authorization: 'Bearer ' + localStorage.getItem('hmtoken') || ''
  //     },
  //     data: bbb,
  //     success: function (res) {
  //       console.log(res);
  //     }

  //   })
  // })
//渲染昵称
  form.on('submit(bc)', function(data){
    var bbb = JSON.stringify(data.field)
    console.log(bbb) //当前容器的全部表单字段，名值对形式：{name: value}
     //阻止表单跳转。如果需要表单跳转，去掉这段即可
    $.ajax({
          type: 'PATCH',
          url: 'http://ttapi.research.itcast.cn/mp/v1_0/user/profile',
          headers: {
            authorization: 'Bearer ' + localStorage.getItem('hmtoken') || ''
          },
          contentType : 'application/json',
          data: bbb,
          success: function (res) {
            window.parent.xuanrandatouxiang()
            xuanranUser()
            $('#quxiao_btn').click()
          }
    
        })
        return false;
  })
  //渲染邮箱
  form.on('submit(de)', function(data){
    var ddd = JSON.stringify(data.field)
    console.log(ddd) //当前容器的全部表单字段，名值对形式：{name: value}
     //阻止表单跳转。如果需要表单跳转，去掉这段即可
    $.ajax({
          type: 'PATCH',
          url: 'http://ttapi.research.itcast.cn/mp/v1_0/user/profile',
          headers: {
            authorization: 'Bearer ' + localStorage.getItem('hmtoken') || ''
          },
          contentType : 'application/json',
          data: ddd,
          success: function (res) {
            
            xuanranUser()
            $('#not_btn').click()
          }
    
        })
        return false;
  });











})
