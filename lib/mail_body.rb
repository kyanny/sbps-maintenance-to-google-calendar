class MailBody
  def initialize(body)
    @body = body
    @parsed = false
  end

  attr_reader :body

  def title
    parse unless @parsed
    @title
  end

  def datetimes
    parse unless @parsed
    @datetimes
  end

  private

  def parse
    body.gsub!(/\r\n|\r|\n/, "\n")

    @title = body.match(/-+\n(.*メンテナンス)のご連絡\n-+/)[1]

    @datetimes = body.match(/◆日時\n([\s\S]+?)◆/)[1].strip.split(/\n/).map { |line|
      if m = line.match(/(\d{4})年(\d{2})月(\d{2})日.*?(\d{2})[;：](\d{2}).*?(\d{2})[;：](\d{2})/)
        datetime = OpenStruct.new
        datetime.startYear = m[1]
        datetime.startMonth = m[2]
        datetime.startDay = m[3]
        datetime.startHour = m[4]
        datetime.startMinute = m[5]
        datetime.endYear = m[1]
        datetime.endMonth = m[2]
        datetime.endDay = m[3]
        datetime.endHour = m[6]
        datetime.endMinute = m[7]
      end
      datetime
    }

    @parsed = true
  end
end
