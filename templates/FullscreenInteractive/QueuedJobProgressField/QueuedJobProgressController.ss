<!doctype html>
<html class="no-js" lang="">

<head>
    <% base_tag %>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title></title>
  <meta name="description" content="">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.4.2/css/all.css" integrity="sha384-/rXc/GQVaYpyDdyxK+ecHPVYJSN9bmVFBvjA/9eOB+pb3F2w2N6fc5qB9Ew5yIns" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css?family=Inconsolata:400,700" rel="stylesheet">

  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
  <script src="https://code.jquery.com/jquery-1.9.1.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>

  <style>
    .container {
        margin: 0 auto;
        width: 90%;
        max-width: 600px;
    }
    html {
        text-align: left;
        padding: 50px 0;
    }

    body {
        font-family: "Inconsolata", sans-serif;
        background: #f8f9fa;
    }

    .progress--loader {
        font-size: 32px;
        line-height: 40px;
        font-weight: bold;
        position: relative;
        padding-left: 70px;
    }

    i {
        margin-right: 20px;
        font-size: 32px;
        position: absolute;
        left: 0;
        top: 0;
        line-height: 40px;
        opacity: 0.3;
    }

    .fas {
        margin-top: 2px;
    }

    .progress--meta {
        opacity: 0.7;
        padding-left: 70px;
    }

    .continue a {
        cursor: pointer;
        background: #74b816;
        color: #fff;
        font-weight: 700;
        display: inline-block;
        border-radius: 8px;
        text-shadow: none;
        height: 60px;
        line-height: 56px;
        padding-left: 40px;
        text-align: center;
        display: block;
        text-decoration: none;
        font-size: 18px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.04);
        transition: .2s ease-out;
        padding-right: 40px;
    }
        .continue a:focus,
        .continue a:active {
            background: #5c940d;
        }

    .continue a.failed {
        background: #dc3545;
    }

    .continue {
        margin: 70px 0 70px 70px;
    }

    .continue--disabled a {
        opacity: 0.6;
        background-color: #fff;
        color: #999;
        cursor: not-allowed;
    }
        .continue--disabled a:focus,
        .continue--disabled a:active {
            background: #fff;
        }

    .continue p {
        margin-top: 20px;
        color: #999;
    }

    fieldset {
        padding: 0 0 0 70px;
        border: none;
    }

    @media all and (max-width: 480px) {
        .progress--loader {
            padding-top: 100px;
            padding-left: 0;
        }

        .progress--meta {
            padding-left: 0;
        }

        fieldset {
            padding: 0;
        }

        .continue {
            margin-left: 0;
        }
    }
  </style>

  <script>
    $(document).ready(function() {
        $('body').on('queuedjob-finished', function(event, data) {
            var status = (data && typeof data.status !== 'undefined') ? data.status : false;

            var continueSection = $('.continue')
                .removeClass('continue--disabled');

            var continueLink = continueSection.find('a');

            if (status && status !== 'bg-success') {
                continueLink.addClass('failed');
                continueLink.text('Back');

                if (continueLink.data('data-failure-href')) {
                    continueLink.attr('href', continueLink.data('data-failure-href'))
                }

                $('.fa-sync')
                    .removeClass('fa-sync fa-spin fa')
                    .addClass('fas fa-times')
            } else {
                continueLink.removeClass('failed');
                continueLink.text('Continue');

                if (continueLink.data('data-success-href')) {
                    continueLink.attr('href', continueLink.data('data-success-href'))
                }

                // change to a tick.
                $('.fa-sync')
                    .removeClass('fa-sync fa-spin fa')
                    .addClass('fas fa-check')
            }

            continueSection.find('p').hide();
        })

        $('body').on('queuedjob-resumed', function(event) {
            var continueSection = $('.continue')
                .addClass('continue--disabled')

            continueSection.find('a').text('Please wait..');
            continueSection.find('p').show();

            // change to a txt.
            $('.fa-check')
                .removeClass('fas fa-check')
                .addClass('fa-sync fa-spin fa')
        })
    })
    </script>
</head>

<body>
  <div class="container">
      <div class="progress--loader">
        <i class="fa fa-sync fa-spin"></i>
        $CurrentJob.Title
      </div>

      <div class="progress--meta">
        <p>Job #$CurrentJob.ID started by $CurrentJob.RunAs.Name at {$CurrentJob.Created.Nice}</p>
      </div>

      $ProgressForm

      <div class="continue continue--disabled">
        <a href="javascript:history.back()" data-success-href="$ContinueLink" data-failure-href="$FailureLink">Please wait..</a>

        <p><small>Servers are working hard on your request. May we suggest a ☕?</small></p>
      </div>
    </div>
</body>

</html>
