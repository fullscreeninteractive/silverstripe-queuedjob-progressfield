window.jQuery.entwine("ss", ($) => {
    $("body").on("queuedjob-finished", function (event, data) {
        var status =
            data && typeof data.status !== "undefined" ? data.status : false;

        var continueSection = $(".continue").removeClass("continue--disabled");

        var continueLink = continueSection.find("a");

        if (status && status !== "bg-success") {
            continueLink.addClass("failed");
            continueLink.text("Back");

            if (continueLink.data("data-failure-href")) {
                continueLink.attr(
                    "href",
                    continueLink.data("data-failure-href")
                );
            }

            $(".fa-sync")
                .removeClass("fa-sync fa-spin fa")
                .addClass("fas fa-times");
        } else {
            continueLink.removeClass("failed");
            continueLink.text("Continue");

            if (continueLink.data("data-success-href")) {
                continueLink.attr(
                    "href",
                    continueLink.data("data-success-href")
                );
            }

            // change to a tick.
            $(".fa-sync")
                .removeClass("fa-sync fa-spin fa")
                .addClass("fas fa-check");
        }

        continueSection.find("p").hide();
    });

    $("body").on("queuedjob-resumed", function (event) {
        var continueSection = $(".continue").addClass("continue--disabled");

        continueSection.find("a").text("Please wait..");
        continueSection.find("p").show();

        // change to a txt.
        $(".fa-check")
            .removeClass("fas fa-check")
            .addClass("fa-sync fa-spin fa");
    });

    $(".queuedjob__progress").entwine({
        onmatch() {
            console.log("match");
            $(this)
                .find(".progress-bar")
                .popover({
                    container: $(this).parents(".field").get(0),
                    placement: "top",
                })
                .popover("show")
                .on("hide.bs.popover", function () {
                    return false;
                });

            $(this)
                .find(".bs-popover-bottom")
                .removeClass("bs-popover-bottom")
                .addClass("bs-popover-top");

            var link = $(this).data("live"),
                self = $(this);
            console.log(link);
            if (link) {
                setTimeout(function () {
                    self.fetchData();
                }, self.getInterval());
            }

            this._super();
        },
        onunmatch() {
            this._super();

            $(this).find(".progress-bar").popover("dispose");
        },
        getInterval() {
            var interval = $(this).data("interval");

            if (!interval || interval < 5000) {
                interval = 5000;
            }

            return interval;
        },
        fetchData() {
            var self = this;
            var progress = $(this).find(".progress-bar"),
                link = $(this).data("live");

            $.getJSON(link, function (resp) {
                if (resp && resp.Percentage) {
                    var changed =
                        $(self)
                            .parents(".field")
                            .find(".popover-header")
                            .text() !== resp.Title ||
                        $(self)
                            .parents(".field")
                            .find(".popover-body")
                            .text() !== resp.Content;

                    progress.css("width", resp.Percentage + "%");

                    if (!progress.hasClass(resp.Status)) {
                        progress.removeClass(
                            "bg-info bg-success bg-danger bg-warning"
                        );
                        progress.addClass(resp.Status);

                        changed = true;
                    }

                    if (resp.Animated) {
                        progress.addClass("progress-bar-animated");
                    } else {
                        progress.removeClass("progress-bar-animated");

                        // fire a global window event for listeners
                        $("body").trigger("queuedjob-finished", [
                            { status: resp.Status },
                        ]);
                    }

                    $(self)
                        .parents(".field")
                        .find(".messages")
                        .html(resp.Messages);

                    if (changed) {
                        progress.popover("hide").popover("dispose");

                        $(self)
                            .parents(".field")
                            .find(".popover-header")
                            .text(resp.Title);
                        $(self)
                            .parents(".field")
                            .find(".popover-body")
                            .text(resp.Content);
                        $(self)
                            .find(".progress-bar")
                            .attr("title", resp.Title)
                            .data("title", resp.Title)
                            .data("content", resp.Content)
                            .attr("data-content", resp.Content);

                        progress.popover("show");
                    } else {
                        progress.popover("show");
                    }

                    if (resp.Status !== "bg-success") {
                        setTimeout(function () {
                            self.fetchData();
                        }, self.getInterval());
                    }
                }
            });
        },
    });
});
