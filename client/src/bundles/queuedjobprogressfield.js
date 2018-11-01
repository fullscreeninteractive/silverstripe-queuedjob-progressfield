// import 'bootstrap';

window.jQuery.entwine('ss', ($) => {
  $('.queuedjob__progress').entwine({
    onmatch() {
      $(this).find('.progress-bar')
        .popover({
            container: $(this).parents('.field').get(0),
            placement: 'top'
        })
        .popover("show")
        .on('hide.bs.popover', function () {
            return false;
        });

      $(this).find('.bs-popover-bottom').removeClass('bs-popover-bottom').addClass('bs-popover-top')

      var link = $(this).data('live'),
        self = $(this);

      if (link) {
        setTimeout(function() {
            self.fetchData()
        }, self.getInterval())
      }

      this._super();
    },
    onunmatch() {
        this._super()

        $(this).find('.progress-bar').popover('dispose')
    },
    getInterval () {
        var interval = $(this).data('interval');

        if (!interval || interval < 5000) {
            interval = 5000
        }

        return interval
    },
    fetchData () {
        var self = this
        var progress = $(this).find('.progress-bar'),
            popover = progress.data('bs.popover'),
            link = $(this).data('live');

        $.getJSON(link, function(resp) {
            if (resp && resp.Percentage) {
                var changed = (
                    $(self).parents('.field').find('.popover-header').text() !== resp.Title ||
                    $(self).parents('.field').find('.popover-body').text() !== resp.Content
                )

                progress.css('width', resp.Percentage +'%')

                if (!progress.hasClass(resp.Status)) {
                    progress.removeClass('bg-info bg-success bg-danger bg-warning')
                    progress.addClass(resp.Status)

                    changed = true
                }

                if (resp.Animated) {
                    progress.addClass('progress-bar-animated')
                } else {
                    progress.removeClass('progress-bar-animated')

                    // fire a global window event for listeners
                    $('body').trigger('queuedjob-finished')
                }

                if (changed) {
                    progress.popover('hide').popover('dispose')

                    $(self).parents('.field').find('.popover-header').text(resp.Title)
                    $(self).parents('.field').find('.popover-body').text(resp.Content)
                    $(self).find('.progress-bar')
                        .attr('title', resp.Title)
                        .data('title', resp.Title)
                        .data('content', resp.Content)
                        .attr('data-content', resp.Content)

                    progress.popover('show')
                }

                if (resp.Status !== 'bg-success') {
                    setTimeout(function() {
                        self.fetchData()
                    }, self.getInterval())
                }
            }
        })
    }
  });
});
