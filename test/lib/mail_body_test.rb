require 'test_helper'

def load_mail_body(name)
  File.read(Rails.root.join("test", "fixtures", "mail_body", "#{name}.txt"))
end

class MailBodyTest < ActiveSupport::TestCase
  class InitializeShouldRaise < ActiveSupport::TestCase
    test "#initialize should raise" do
      assert_raise(ArgumentError) { MailBody.new }
    end
  end

  class InitializeShouldNotRaise < ActiveSupport::TestCase
    test "#initialize should not raise" do
      assert_nothing_raised { MailBody.new('Lorem ipsum') }
    end
  end

  class BodyShouldReturnBody < ActiveSupport::TestCase
    setup do
      @mail_body = MailBody.new('Lorem ipsum')
    end

    test "#body should return @body" do
      assert_equal 'Lorem ipsum', @mail_body.body
    end
  end

  class JcbCredit20160208
    class TitleShouldReturnTitle < ActiveSupport::TestCase
      setup do
        @mail_body = MailBody.new(load_mail_body("jcb_credit_20160208"))
      end

      test "#title should return title" do
        assert_equal "ジェーシービー（クレジットカード決済）メンテナンス", @mail_body.title
      end
    end

    class DatetimesShouldReturn3Dates < ActiveSupport::TestCase
      setup do
        @mail_body = MailBody.new(load_mail_body("jcb_credit_20160208"))
      end

      test "#datetimes should return 3 dates" do
        assert_equal 3, @mail_body.datetimes.length
      end

      class FirstDatetimeShouldReturnDateTime < ActiveSupport::TestCase
        setup do
          @mail_body = MailBody.new(load_mail_body("jcb_credit_20160208"))
          @datetime = @mail_body.datetimes[0]
        end

        test "startYear" do
          assert_equal "2016", @datetime.startYear
        end

        test "startMonth" do
          assert_equal "02", @datetime.startMonth
        end

        test "startDay" do
          assert_equal "18", @datetime.startDay
        end
      end
    end
  end
end
